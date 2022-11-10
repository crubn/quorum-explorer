"use strict";
const { MongoDB } = require('../../providers/mongo');
const { TransactionCollectionName } = require('../schemas/transaction');
class TransactionsCollection {
    /**
           * Add transactions
           */
    static async addTransactions(node, transactionData) {
        return new Promise(async (resolve) => {
            console.log('adding transactions', transactionData);
            const conn = MongoDB.useDB(node);
            conn.collection(TransactionCollectionName)
                .insertMany(transactionData, { ordered: false })
                .then(() => {
                console.info('New Transactions created');
                resolve(true);
            })
                .catch((error) => {
                console.error(`Transactions creation failed: ${error}`);
                resolve(false);
            });
        });
    }
}
module.exports = { TransactionsCollection };
