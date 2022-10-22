let User = require("../models/user");
let Stock = require("../models/stocks");
let moment = require("moment");
const fs = require("fs");
const baseUrl = process.env.baseUrl;
const uploadFile = require("../middleware/upload");
const Notification = require("../middleware/notifications");
const path = require("path");
var bcrypt = require("bcryptjs");
const async = require("async");
let axios = require("axios");

const IEX_PKEY = process.env.IEX_PKEY;

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function getShareDetails(symbol, cb) {
  axios
    .get(
      `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${symbol}&types=quote&token=${IEX_PKEY}`
    )
    .then((response) => {
      cb(null, response.data[Object.keys(response.data)[0]].quote);
    })
    .catch((err) => {
      console.log(err);
      cb(err);
    });
}
const UserController = {
  registerUser(req, res, next) {
    var data = req.body;
    if (data.email && data.password) {
      if (!validateEmail(data.email)) {
        throw new Error("Please send valid email");
      } else {
        User.findOne({ email: data.email }, function (err, userData) {
          if (err) {
            next({ message: err.message || "Network error" });
          } else if (userData) {
            next({ message: "Already user exists" });
          } else {
            var registerUser = new User({
              email: data.email,
              password: data.password,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              gender: data.gender,
              dob: (data.dob && moment(data.dob).format("X")) || "",
            });
            User.createUser(registerUser, function (err, newUser) {
              if (err) {
                next({ message: err.message || "Network error" });
              } else {
                let emailNotification = {
                  username:
                    registerUser.firstName + " " + registerUser.lastName,
                  message:
                    "Congratulations, You have been successfully registered, We will get back to you once the account is activated",
                  subject: "Account Registration",
                  email: registerUser.email,
                };
                Notification.sendEmail(
                  emailNotification,
                  "../templates/welcome.html",
                  function (err, notificationResult) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("successfully sent email");
                    }
                  }
                );
                return next({
                  message: "Successfully created new user",
                  code: "200",
                  status: "Success",
                  data: {},
                });
              }
            });
          }
        });
      }
    } else {
      throw new Error("Please enter email or password to register");
    }
  },
  loginUser(req, res) {
    if (!req.user) {
      throw new Error("User has not been authenticated");
    } else {
      if (req.user.roles == "user") {
        return res.json({
          status: "success",
          statusCode: 200,
          message: "User has been authenticated",
          data: req.user,
        });
      } else {
        next({ message: "Please login with user account", code: 401 });
      }
    }
  },
  loginAdminUser(req, res, next) {
    if (!req.user) {
      next({ message: "User has not been authenticated", code: 401 });
    } else {
      if (req.user.roles == "admin") {
        return res.json({
          status: "success",
          statusCode: 200,
          message: "User has been authenticated",
          data: req.user,
        });
      } else {
        next({ message: "User is not admin user", code: 401 });
      }
    }
  },
  getAllUsers(req, res, next) {
    if (req.user && req.user.roles == "admin") {
      User.find({ roles: "user" }, function (err, userData) {
        if (err) {
          console.log(err);
          next({ message: err.message || "Network Error" });
        } else {
          return res.json({
            status: "success",
            statusCode: 200,
            message: "User data",
            data: userData,
          });
        }
      });
    } else {
      next({ message: "user is a not admin", code: "404" });
    }
  },
  async upload(req, res, next) {
    try {
      await uploadFile(req, res);

      if (req.file == undefined) {
        return next({ message: "Please upload a file!", code: 400 });
      }
      if (req.user) {
        console.log("####", req.file);
        User.updateOne(
          { _id: req.user._id },
          { documentUrl: req.file.filename },
          function (err, updatedUser) {
            if (err) {
              console.log(err);
            } else {
              return res.json({
                status: "success",
                statusCode: 200,
                message: "Uploaded the file successfully: " + req.file.filename,
                data: {},
              });
            }
          }
        );
      } else {
      }
    } catch (err) {
      console.log(err);

      if (err.code == "LIMIT_FILE_SIZE") {
        return next({ message: "File size cannot be larger than 2MB!" });
      }

      return next({
        message: `Could not upload the file: ${req.file.filename}`,
      });
    }
  },
  getListFiles(req, res, next) {
    const directoryPath = path.join(__dirname, "../uploads/");

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return next({ message: "Unable to scan files!" });
      }

      let fileInfos = [];

      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });
      return res.json({
        status: "success",
        statusCode: 200,
        message: "List of all documents",
        data: fileInfos,
      });
    });
  },
  updateUser(req, res, next) {
    var data = req.body;
    if (data.firstName && data.firstName == "") {
      return next({ message: "First name is empty" });
    } else if (data.lastName && data.lastName == "") {
      return next({ message: "Last name is empty" });
    } else if (data.dob && data.dob == "") {
      return next({ message: "dob is empty" });
    } else if (data.gender && data.gender == "") {
      return next({ message: "Gender is empty" });
    }
    data.dob = moment(data.dob).format("X");
    User.updateOne({ _id: req.user._id }, data, function (err, updatedUser) {
      if (err) {
        console.log(err);
        return next({ message: err.message || "Network error" });
      } else {
        return res.json({
          status: "success",
          statusCode: 200,
          message: "Successfully updated the user",
          data: {},
        });
      }
    });
  },
  userPasswordChange(req, res, next) {
    let body = req.body;
    User.comparePassword(
      body.oldPassword,
      req.user.password,
      function (err, isMatch) {
        if (err) {
          return next({ message: "Old password is not matched" });
        }
        if (isMatch) {
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(body.newPassword, salt, function (err, hash) {
              User.updateOne(
                { _id: req.user._id },
                { password: hash },
                function (err, updatedPassword) {
                  if (err) {
                    console.log(err);
                    return next({ message: err.message || "Network Error" });
                  } else {
                    return res.json({
                      status: "success",
                      statusCode: 200,
                      message: "Password has been changed successfully",
                      data: {},
                    });
                  }
                }
              );
            });
          });
        } else {
          return next({ message: "Password is incorrect" });
        }
      }
    );
  },
  download(req, res, next) {
    const fileName = req.params.name;
    const directoryPath = path.join(__dirname, "../uploads/");

    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        return next({ message: "Could not download the file." });
      }
    });
  },
  updateUserAccount(req, res, next) {
    if (req.user.roles == "admin") {
      var getUserId = req.params.id;
      User.findOne({ _id: getUserId }, function (err, userDetails) {
        if (err) {
          console.log(err);
          return next({ message: err.message || "Network Error" });
        } else if (userDetails) {
          if (userDetails.account_verified) {
            return next({ message: "This account has already been activated" });
          } else {
            User.updateOne(
              { _id: getUserId },
              { account_verified: true },
              function (err, updatedUser) {
                if (err) {
                  console.log(err);
                  return next({ message: err.message || "Network Error" });
                } else {
                  let emailNotification = {
                    username:
                      userDetails.firstName + " " + userDetails.lastName,
                    message:
                      "Congratulations, Your account has been activated successfully",
                    subject: "Account Activated",
                    email: userDetails.email,
                  };
                  Notification.sendEmail(
                    emailNotification,
                    "../templates/welcome.html",
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
                    message: "Account has been activated successfully",
                    data: {},
                  });
                }
              }
            );
          }
        } else {
          return next({ message: "No User found" });
        }
      });
    } else {
      return next({ message: "Please login with admin login" });
    }
  },
  userPortfolio(req, res, next) {
    let totalShareHoldingsPrice = 0;
    let sharesData = [];
    Stock.find(
      { userId: req.user._id, status: "Active" },
      function (err, result) {
        if (err) {
          console.log(err);
          return next({ message: err.message || "Network Error" });
        } else if (result.length > 0) {
          async.eachSeries(
            result,
            function (list, cb) {
              getShareDetails(list.symbol, function (err, shareResult) {
                if (err) {
                  console.log(err);
                  cb();
                } else {
                  let totalPrice = shareResult.latestPrice * list.shares;
                  totalShareHoldingsPrice =
                    totalShareHoldingsPrice + totalPrice;
                  list.sharesTotalPrice = totalPrice;
                  list.currentPrice = shareResult.latestPrice;
                  sharesData.push(list);
                  cb();
                }
              });
            },
            function (err) {
              if (err) {
                console.log(err);
                return next({ message: err.message || "Network Error" });
              } else {
                return res.json({
                  status: "success",
                  statusCode: 200,
                  message: "User Portfolio",
                  data: {
                    sharesAsset: totalShareHoldingsPrice,
                    walletBalance: req.user.wallet,
                    sharesData: sharesData,
                  },
                });
              }
            }
          );
        } else {
          return res.json({
            status: "success",
            statusCode: 200,
            message: "User Portfolio",
            data: {
              sharesAsset: totalShareHoldingsPrice,
              walletBalance: req.user.wallet,
              sharesData: [],
            },
          });
        }
      }
    );
  },
};
module.exports = UserController;
