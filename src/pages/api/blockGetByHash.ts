import type { NextApiRequest, NextApiResponse } from "next";
import { ethApiCall } from "../../common/lib/ethApiCall";
import { QuorumBlock } from "../../common/types/Explorer";
import apiAuth from "../../common/lib/authentication";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log(req.body);
  const blockHash = req.body.blockHash;
  const rpcUrl = req.body.rpcUrl;
  let quorumBlock: QuorumBlock = {
    statusText: "error",
    number: "-1",
    hash: "",
    transactionsRoot: "",
    stateRoot: "",
    receiptsRoot: "",
    miner: "",
    extraData: "",
    size: "",
    gasUsed: "",
    gasLimit: "",
    timestamp: Date(),
    uncles: [],
    transactions: [],
  };

  const checkSession = await apiAuth(req, res);
  if (!checkSession) {
    return;
  }

  try {
    const ethBlockByHash = await ethApiCall(rpcUrl, "eth_getBlockByHash", [
      blockHash,
      true,
    ]);
    quorumBlock["statusText"] = ethBlockByHash.statusText;
    quorumBlock["number"] = ethBlockByHash.data.result.number;
    quorumBlock["hash"] = ethBlockByHash.data.result.hash;
    quorumBlock["transactionsRoot"] =
      ethBlockByHash.data.result.transactionsRoot;
    quorumBlock["stateRoot"] = ethBlockByHash.data.result.stateRoot;
    quorumBlock["receiptsRoot"] = ethBlockByHash.data.result.receiptsRoot;
    quorumBlock["miner"] = ethBlockByHash.data.result.miner;
    quorumBlock["extraData"] = ethBlockByHash.data.extraData;
    quorumBlock["size"] = ethBlockByHash.data.result.size;
    quorumBlock["gasUsed"] = ethBlockByHash.data.result.gasUsed;
    quorumBlock["gasLimit"] = ethBlockByHash.data.result.gasLimit;
    quorumBlock["timestamp"] = ethBlockByHash.data.result.timestamp;
    quorumBlock["uncles"] = ethBlockByHash.data.result.uncles;
    quorumBlock["transactions"] = ethBlockByHash.data.result.transactions;
  } catch (e) {
    console.error(
      "Node is unreachable. Ensure ports are open and client is running!"
    );
    res.status(500);
  } finally {
    res.status(200).json(quorumBlock);
    res.end();
  }
}
