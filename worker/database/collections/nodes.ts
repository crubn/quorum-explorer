const { getNodeModelInDB: gNMIDB } =require('../schemas/node');

const { MongoDB } = require('../../providers/mongo');


class NodesCollection {
  public static async setLastBlockVisited(node: string, blockNumber: any) {
    return new Promise(async (resolve, reject) => {
      // console.log('adding nodes', blockNumber
      //     .map((node: any) => parseInt(node.blockNumber, 16)));
      const conn = MongoDB.useDB('blocks');
      gNMIDB(conn)
          .updateOne(
              { node },
              {
                $set: {
                  lastBlockVisited: blockNumber,
                },
              },
              { upsert: true },
          )
          .then(() => {
            console.info('Last block visited updated:', blockNumber);
            resolve(true);
          })
          .catch((error: any) => {
            console.error(`Nodes creation failed: ${error}`);
            reject(error);
          });
    });
  }

  public static async getLastBlockVisited(node: string) {
    return new Promise(async (resolve, reject) => {
      // console.log('adding nodes', blockNumber
      //     .map((node: any) => parseInt(node.blockNumber, 16)));
      const conn = MongoDB.useDB('blocks');
      gNMIDB(conn)
          .findOne({ node })
          .then((doc: any) => {
            console.info('Last block visited fetched');
            if (doc) {
              resolve(doc.lastBlockVisited);
            } else {
              resolve(0);
            }
          })
          .catch((error: any) => {
            console.error(`Nodes creation failed: ${error}`);
            reject(error);
          });
    });
  }
}

module.exports = { NodesCollection };
