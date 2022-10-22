
const User = require("./User");
const Stocks = require("./stocks")


module.exports = function (app) {
  app.use("/api/v1", User);
  app.use("/api/v1", Stocks)
};
