const { MongoDB } = require('../../providers/mongo');
const { TransactionCollectionName } = require('../schemas/transaction');


class TransactionsCollection {
  /**
         * Add transactions
         */
  public static async addTransactions(node: string, transactionData: any) {
    return new Promise(async (resolve) => {
      console.log('adding transactions', transactionData);
      const conn = MongoDB.useDB(node);
      conn.collection(TransactionCollectionName)
          .insertMany(transactionData, { ordered: false })
          .then(() => {
            console.info('New Transactions created');
            resolve(true);
          })
          .catch((error: any) => {
            console.error(`Transactions creation failed: ${error}`);
            resolve(false);
          });
    });
  }
}

module.exports = { TransactionsCollection };
