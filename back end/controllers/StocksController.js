let axios = require("axios");
let Stock = require("../models/stocks");
let User = require("../models/user");
let Transaction = require("../models/transactions");
const { v4: uuidv4 } = require("uuid");
const Notification = require("../middleware/notifications");
const ObjectId = require("mongodb").ObjectId;
let moment = require("moment");

const IEX_PKEY = process.env.IEX_PKEY;

function createTransaction(data, userData, transactionType, cb) {
  let stockAmount = parseInt(data.shares) * data.latestPrice;
  let saveTransaction = new Transaction({
    amount: stockAmount,
    shares: data.shares,
    transactionDate: moment().format("x"),
    transactionId: uuidv4(),
    transactionType: transactionType,
    userId: data.userId,
    stockId: data._id,
  });
  saveTransaction.save(function (err, savedTransaction) {
    if (err) {
      cb(err);
    } else {
      let updateWallet;
      if (transactionType == "buy") {
        updateWallet = userData.wallet - stockAmount;
      } else {
        updateWallet = userData.wallet + stockAmount;
      }
      User.updateOne(
        { _id: userData._id },
        { wallet: updateWallet },
        function (err, updatedWallet) {
          if (err) {
            console.log(err);
          } else {
            cb(null, savedTransaction);
          }
        }
      );
    }
  });
}
const StocksController = {
  recommendation(req, res, next) {
    const holdings = [];
    axios
      .get(
        `https://cloud.iexapis.com/stable/stock/market/batch?symbols=msft,ABB,ABBV,ABC,ABEV,AFG,AGL,AGM,AL,ALB,BA,BAC,BAH,BAM,nflx,googl,NFTY,DAC,DAL,DAO,DAR,HAE,HAL,HBI,HBM,AMZN,TSLA,INTC,CSCO&types=quote&token=${IEX_PKEY}`
      )
      .then(function (response) {
        let stockData = {};
        Stock.find(
          { userId: req.user._id, status: "Active" },
          function (err, stocksResult) {
            if (err) {
              console.log(err);
              next({ message: err.message || "Network error" });
            } else if (stocksResult.length > 0) {
              stocksResult.map((list) => {
                stockData[list.symbol] = list.shares;
              });
              Object.keys(response.data).forEach(function (key) {
                let getKeyData = response.data[key].quote;
                if (stockData[getKeyData.symbol]) {
                  getKeyData.isUserHoldingStocks = true;
                  getKeyData.userTotalHoldings = stockData[getKeyData.symbol];
                } else {
                  getKeyData.isUserHoldingStocks = false;
                  getKeyData.userTotalHoldings = 0;
                }
                holdings.push(getKeyData);
              });
              return res.json({
                status: "success",
                statusCode: 200,
                message: "Successfully got recommendations",
                data: holdings,
              });
            } else {
              Object.keys(response.data).forEach(function (key) {
                holdings.push(response.data[key].quote);
              });
              return res.json({
                status: "success",
                statusCode: 200,
                message: "Successfully got recommendations",
                data: holdings,
              });
            }
          }
        );
      })
      .catch(function (err) {
        console.log("error from server- API routes", err);
        next({
          message: "Something went wrong on the server. Please try again.",
          code: 500,
        });
      });
  },
  getStocks(req, res, next) {
    const symbol = req.query.symbol;
    axios
      .get(
        `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${symbol}&types=quote&token=${IEX_PKEY}`
      )
      .then((response) => {
        return res.json({
          status: "success",
          statusCode: 200,
          message: "Successfully got recomendations",
          data: response.data[Object.keys(response.data)[0]].quote,
        });
      })
      .catch((err) => {
        console.log("error from server- API routes", err);
        return next({
          message: "Something went wrong on the server. Please try again.",
          code: 500,
        });
      });
  },
  buyStocks(req, res, next) {
    const { holding, shares } = req.body;
    const { companyName, symbol, latestPrice, changePercent } = holding;
    if (req.user.wallet < parseInt(shares) * latestPrice) {
      throw new Error("Wallet balance is low");
    }
    Stock.findOne(
      { userId: req.user._id, symbol: symbol },
      function (err, result) {
        if (err) {
          console.log(err);
          return next({
            message: "Something went wrong on the server. Please try again.",
          });
        } else if (result) {
          result.shares = parseInt(shares) + result.shares;
          result.latestPrice = latestPrice;
          result.status = "Active";
          Stock.updateOne(
            { _id: result._id },
            result,
            function (err, updatedStocks) {
              if (err) {
                console.log(err);
                return next({
                  message:
                    "Something went wrong on the server. Please try again.",
                  code: 500,
                });
              } else {
                result.shares = shares;
                createTransaction(
                  result,
                  req.user,
                  "buy",
                  function (err, transaction) {
                    if (err) {
                      console.log(err);
                      return next({
                        message:
                          "Something went wrong on the server. Please try again.",
                        code: 500,
                      });
                    } else {
                      let emailNotification = {
                        username: req.user.firstName + " " + req.user.lastName,
                        message:
                          "Please find below details of Trades executed by you",
                        subject: "DETAILS OF YOUR TRADE",
                        email: req.user.email,
                        orderId: transaction.transactionId,
                        stock: companyName,
                        time: moment(transaction.transactionDate).format(
                          "YYYY-MM-DD HH:mm ss"
                        ),
                        qty: shares,
                        amount: latestPrice,
                        value: transaction.amount,
                        type: "Buy",
                      };
                      Notification.sendEmail(
                        emailNotification,
                        "../templates/stocks.html",
                        function (err, notificationResult) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log("successfully sent email");
                          }
                        }
                      );
                      return res.json({
                        status: "success",
                        statusCode: 200,
                        message: "Successfully purchased stocks",
                        data: {},
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          let createStock = new Stock({
            symbol: symbol,
            shares: shares,
            latestPrice: latestPrice,
            companyName: companyName,
            changePercent: changePercent,
            userId: req.user._id,
          });
          createStock.save(function (err, stocksData) {
            if (err) {
              console.log(err);
              return next({
                message:
                  "Something went wrong on the server. Please try again.",
                code: 500,
              });
            } else {
              createTransaction(
                stocksData,
                req.user,
                "buy",
                function (err, transaction) {
                  if (err) {
                    console.log(err);
                    return next({
                      message:
                        "Something went wrong on the server. Please try again.",
                      code: 500,
                    });
                  } else {
                    let emailNotification = {
                      username: req.user.firstName + " " + req.user.lastName,
                      message:
                        "Please find below details of Trades executed by you",
                      subject: "DETAILS OF YOUR TRADE",
                      email: req.user.email,
                      orderId: transaction.transactionId,
                      stock: companyName,
                      time: moment(transaction.transactionDate).format(
                        "YYYY-MM-DD HH:mm ss"
                      ),
                      qty: shares,
                      amount: latestPrice,
                      value: transaction.amount,
                      type: "Buy",
                    };
                    Notification.sendEmail(
                      emailNotification,
                      "../templates/stocks.html",
                      function (err, notificationResult) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("successfully sent email");
                        }
                      }
                    );
                    return res.json({
                      status: "success",
                      statusCode: 200,
                      message: "Successfully purchased " + shares + " stocks",
                      data: {},
                    });
                  }
                }
              );
            }
          });
        }
      }
    );
  },
  sellStocks(req, res, next) {
    const { holding, shares } = req.body;
    const { symbol, latestPrice, companyName } = holding;
    Stock.findOne(
      { userId: req.user._id, symbol: symbol, status: "Active" },
      function (err, result) {
        if (err) {
          console.log(err);
        } else if (result) {
          result.shares = result.shares - parseInt(shares);
          result.latestPrice = latestPrice;
          if (result.shares == 0) {
            result.status = "In-Active";
          } else if (result.shares < 0) {
            return next({ message: "Please select correct shares" });
          }
          Stock.updateOne(
            { _id: result._id },
            result,
            function (err, updatedStocks) {
              if (err) {
                console.log(err);
                return next({
                  message:
                    "Something went wrong on the server. Please try again.",
                  code: 500,
                });
              } else {
                result.shares = parseInt(shares);
                createTransaction(
                  result,
                  req.user,
                  "sell",
                  function (err, transaction) {
                    if (err) {
                      console.log(err);
                      return next({
                        message:
                          "Something went wrong on the server. Please try again.",
                        code: 500,
                      });
                    } else {
                      let emailNotification = {
                        username: req.user.firstName + " " + req.user.lastName,
                        message:
                          "Please find below details of Trades executed by you",
                        subject: "DETAILS OF YOUR TRADE",
                        email: req.user.email,
                        orderId: transaction.transactionId,
                        stock: companyName,
                        time: moment(transaction.transactionDate).format(
                          "YYYY-MM-DD HH:mm ss"
                        ),
                        qty: shares,
                        amount: latestPrice,
                        value: transaction.amount,
                        type: "Sell",
                      };
                      Notification.sendEmail(
                        emailNotification,
                        "../templates/stocks.html",
                        function (err, notificationResult) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log("successfully sent email");
                          }
                        }
                      );
                      return res.json({
                        status: "success",
                        statusCode: 200,
                        message: "Successfully sold the stocks",
                        data: {},
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          return next({ message: "cannot find selected holding." });
        }
      }
    );
  },
  sharesTransaction(req, res, next) {
    Transaction.aggregate(
      [
        {
          $match: {
            userId: ObjectId(req.user._id),
          },
        },
        {
          $lookup: {
            from: "stocks",
            localField: "stockId",
            foreignField: "_id",
            as: "stocks",
          },
        },
        {
          $unwind: {
            path: "$stocks",
          },
        },
      ],
      function (err, result) {
        if (err) {
          console.log(err);
          next({ message: err.message || "Network Error" });
        } else if (result) {
          return res.json({
            status: "success",
            statusCode: 200,
            message: "Transactions data",
            data: result,
          });
        }
      }
    );
  },
  graphsData(req, res, next) {
    const symbol = req.query.symbol;
    axios
      .get(
        `https://cloud.iexapis.com/stable/stock/${symbol}/chart/7d?token=${IEX_PKEY}`
      )
      .then((response) => {
        return res.json({
          status: "success",
          statusCode: 200,
          message: "Transactions data",
          data: response.data,
        });
      })
      .catch((error) => {
        console.log("error from server- API routes", error);
        return next({ message: error.message || "Network Error" });
      });
  },
};
module.exports = StocksController;
