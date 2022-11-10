"use strict";
const { model, Schema } = require('mongoose');
const TransactionCollectionName = 'Transactions';
const TransactionsSchema = new Schema({
    hash: { type: String, required: true, unique: true },
}, {
    collection: TransactionCollectionName,
    versionKey: false,
    timestamps: true,
});
const Transaction = model(TransactionCollectionName, TransactionsSchema);
module.exports = { TransactionCollectionName, Transaction };
