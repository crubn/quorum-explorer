const axios = require('axios');
const Agent = require('agentkeepalive');
const HttpsAgent = require('agentkeepalive').HttpsAgent;

const { config: cnfg } = require('../helpers/load-config');
const { TransactionsCollection: TCX } =
  require('../database/collections/transactions');
const { NodesCollection: NCX } =
  require('../database/collections/nodes');
const { range: rng } = require('../helpers');

const timeout=process.env.AXIOS_TIMEOUT || 1200000;
const keepAliveAgent = new Agent({
  timeout: Number(timeout),
  freeSocketTimeout: Number(timeout),
  keepAliveMsecs: Number(timeout),
});

const httpsKeepAliveAgent = new HttpsAgent({
  timeout: Number(timeout),
  freeSocketTimeout: Number(timeout),
  keepAliveMsecs: Number(timeout),
});

class TransactionsController {
  private nodes = cnfg.nodes;
  private stopFlag = false;

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public manageStopFlag(ms: boolean) {
    this.stopFlag = ms;
  }

  async init() {
    this.stopFlag=false;
    while (true) {
      if (this.stopFlag) {
        console.log('Stopping Polling');
        break;
      } else {
        for await(const node of this.nodes) {
          await this
              .manageBlockFetching(node);
        }
        await this.delay(10000);
      }
    }
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
        timeout: Number(timeout),
        httpAgent: keepAliveAgent,
        httpsAgent: httpsKeepAliveAgent,
      }).then(function(response: any) {
        console.log('FETCHED:', parseInt(response.data.result.number, 16));
        resolve(response.data.result);
      }).catch(function(err: any) {
        console.log('err fetching getBlockByNumber from blockchain:', err);
      });
    });
  }

  public async manageBlockFetching(node: any) {
    let lastCheckedBlock = await NCX.getLastBlockVisited(node.rpcUrl);
    await this.fetchBlock(node.rpcUrl, [
      'latest',
      true,
    ])
        .then(async (res) => {
          const quorumBlock: any = res;
          let currentBlock = parseInt(quorumBlock.number, 16);
          // let currentBlock = 1000;

          const oldCurrentBlock = currentBlock;

          if (currentBlock >= lastCheckedBlock) {
            const batches = Math
                .ceil((currentBlock - lastCheckedBlock) / Number(process
                    .env.BATCH_LIMIT));
            for (let index = 0; index < batches; index++) {
              await new Promise(async (resolve, reject) => {
                const lastXBlockArray = rng(
                    currentBlock,
                    // 5450,
                    // 5250,
                    Math.min(currentBlock, Math.max(lastCheckedBlock,
                        currentBlock - Number(process.env.BATCH_LIMIT))),
                    -1,
                );

                console.log('lastXBlockArray', lastXBlockArray);
                const returns = await lastXBlockArray
                    .map(async (block: any) => {
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
                        ar.push(...a.transactions.map((b: any) => {
                          try {
                            b.createdAt = new Date(parseInt(a
                                .timestamp, 16) * 1000).toISOString();
                          } catch (error) {
                            b.createdAt = new Date().toISOString();
                          }
                          b._id = b.hash;
                          return b;
                        }));
                      });

                  if (ar.length > 0) {
                    await TCX
                        .addTransactions(node.rpcUrl, ar);
                  }
                  console.log('TOTAL Transactions:', ar.length);
                  if (currentBlock - Number(process.env.BATCH_LIMIT) > 0) {
                    currentBlock = currentBlock -
                    Number(process.env.BATCH_LIMIT);
                  }
                  resolve(true);
                });
              });
            }
            return oldCurrentBlock;
          } else {
            await TCX.clearTransactions(node.rpcUrl);
            return 0;
          }
        }).then(async (oldCurrentBlock) => {
          lastCheckedBlock = oldCurrentBlock;
          await NCX.setLastBlockVisited(node.rpcUrl, oldCurrentBlock);
        })
        .catch((err) => {
          console.error(err.message);
        });
  }
}
module.exports = { TransactionsController };
