const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockSchema = new Schema(
  {
    symbol: {
      type: String,
      default: "",
    },
    shares: {
      type: Number,
    },
    latestPrice: {
      type: Number,
      default: "",
    },

    companyName: {
      type: String,
      default: "",
    },
    changePercent: {
      type: String,
      default: "",
    },
    sharesTotalPrice: {
      type: String,
    },
    currentPrice: {
      type: String,
    },
    status: {
      type: String,
      default: "Active",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    strict: false,
    versionKey: false,
    usePushEach: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("Stock", StockSchema);
