const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
    {
        amount:{
            type: Number
        },
        currency:{
            type: String,
            default:"$"
        },
        transactionDate:{
            type: Number
        },
        transactionId:{
            type: String
        },
        transactionType:{
            type: String,
            enum:["sell","buy"]
        },
        userId:{
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        stockId:{
            type: Schema.Types.ObjectId,
            ref: "Stock"
        }
    },
    {
        strict: false,
        versionKey: false,
        usePushEach: true,
        timestamps: true,
    }
);


module.exports = mongoose.model('Transaction', TransactionSchema);