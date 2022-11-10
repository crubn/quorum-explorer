const axios = require('axios');
const { config: cnfg } = require('../helpers/load-config');
const { TransactionsCollection: TCX } =
  require('../database/collections/transactions');
const { range } = require('../helpers');

class TransactionsController {
  private lastCheckedBlock: number = 1;
  private nodes = cnfg.nodes;

  init() {
    this.lastCheckedBlock = 1;
    // setInterval(() => {
    this.nodes.forEach((node: any) => this.manageBlockFetching(node));
    // }, 5000);
  }

  /**
             * Fetch a block
            */
  public async fetchBlock(url: string, data: any) {
    return new Promise(async (resolve) => {
      // console.log('url,data', url, data);
      await axios({
        method: 'post',
        url: url,
        data: {
          jsonrpc: '2.0',
          method: cnfg.methods.getBlockByNumber,
          params: data,
          id: 1,
        },
        headers: { 'Content-Type': 'application/json' },
        timeout: 1200000,
      }).then(function(response: any) {
        console.log('FETCHED:', parseInt(response.data.result.number, 16));
        resolve(response.data.result);
      }).catch(function(err: any) {
        console.log('err fetching getBlockByNumber from blockchain:', err);
      });
    });
  }

  public async manageBlockFetching(node: any) {
    await this.fetchBlock(node.rpcUrl, [
      'latest',
      true,
    ])
        .then(async (res) => {
          const quorumBlock: any = res;
          let currentBlock = parseInt(quorumBlock.number, 16);

          const batches = Math.floor(currentBlock / 200);
          this.lastCheckedBlock = currentBlock;
          for (let index = 0; index < batches; index++) {
            await new Promise((resolve, reject) => {
              const lastXBlockArray = range(
                  currentBlock,
                  // 5450,
                  // 5250,
                  Math.min(currentBlock, currentBlock - 200),
                  -1,
              );

              console.log('lastXBlockArray', lastXBlockArray);
              const returns = lastXBlockArray.map(async (block: any) => {
                const res: any = await this.fetchBlock(node.rpcUrl, [
                  '0x' + block.toString(16),
                  true,
                ]);
                return res;
              });
              Promise.all(returns).then(async (values: any) => {
                const ar: any = [];
                values
                    .filter((a: any) => a.transactions.length > 0)
                    .forEach((a: any) => {
                      ar.push(...a.transactions.map((b: any) =>{
                        b.createdAt=new Date().toISOString();
                        b._id=b.hash;
                        return b;
                      }));
                    });

                if (ar.length > 0) {
                  await TCX
                      .addTransactions(node.name, ar);
                }
                console.log('TOTAL Transactions:', ar.length);
                if (currentBlock - 200 > 0) {
                  currentBlock = currentBlock - 200;
                }
                resolve(true);
              });
            });
          }
        })
        .catch((err) => {
          console.error(err.message);
        });
  }
}
module.exports = { TransactionsController };
