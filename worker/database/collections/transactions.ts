const { MongoDB: MDB } = require('../../providers/mongo');

const TCNN = 'Transactions';

class TransactionsCollection {
  /**
         * Add transactions
         */
  public static async addTransactions(node: string, transactionData: any) {
    return new Promise(async (resolve) => {
      console.log('adding transactions', transactionData
          .map((transaction: any) => parseInt(transaction.blockNumber, 16)));
      const conn = MDB.useDB(node);
      conn.collection(TCNN)
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

  /**
         * Clear transactions
         */
  public static async clearTransactions(node: string) {
    return new Promise(async (resolve) => {
      const conn = MDB.useDB(node);
      conn.collection(TCNN)
          .deleteMany({})
          .then(() => {
            console.info('All Transactions cleared');
            resolve(true);
          })
          .catch((error: any) => {
            console.error(`Transactions deletion failed: ${error}`);
            resolve(false);
          });
    });
  }
}

module.exports = { TransactionsCollection };
