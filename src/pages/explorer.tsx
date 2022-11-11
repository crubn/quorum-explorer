import { Container, Divider } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import getConfig from "next/config";
import { useCallback, useEffect, useRef, useState } from "react";
import ExplorerBlocks from "../common/components/Explorer/ExplorerBlocks";
import ExplorerTxns from "../common/components/Explorer/ExplorerTxns";
import AccessDenied from "../common/components/Misc/AccessDenied";
import PageHeader from "../common/components/Misc/PageHeader";
import { range } from "../common/lib/explorer";
import { configReader } from "../common/lib/getConfig";
import { getDetailsByNodeName } from "../common/lib/quorumConfig";
import { QuorumBlock, QuorumTxn } from "../common/types/Explorer";
import { QuorumConfig, QuorumNode } from "../common/types/QuorumConfig";
const { publicRuntimeConfig } = getConfig();

import axios from "axios";
import { refresh5s } from "../common/lib/common";

interface IState {
  selectedNode: string;
  blocks: QuorumBlock[];
  transactions: QuorumTxn[];
}

interface IProps {
  config: QuorumConfig;
}

export default function Explorer({ config }: IProps) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const controller = new AbortController();
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalIntervalId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [explorer, setExplorer] = useState<IState>({
    selectedNode: config.nodes[0].name,
    blocks: [],
    transactions: [],
  });
  const [lookBackBlocks, setLookBackBlocks] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [total, setTotal] = useState(0);
  const totalRef = useRef(total);
  totalRef.current = total;

  const blocksRef = useRef(explorer.blocks);
  blocksRef.current = explorer.blocks;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const onSelectChange = (e: any) => {
    e.preventDefault();
    controller.abort();
    clearInterval(intervalRef?.current as NodeJS.Timeout);
    clearInterval(totalIntervalId.current);
    setLookBackBlocks(e.target.value);
  };

  // use useCallBack
  const nodeInfoHandler = useCallback(
    async (name: string) => {
      if (isPaused === true) {
        return;
      }
      const needle: QuorumNode = getDetailsByNodeName(config, name);
      axios({
        method: "POST",
        url: `/api/blockGetByNumber`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          rpcUrl: needle.rpcUrl,
          blockNumber: "latest",
        }),
        signal: controller.signal,
        timeout: 10000,
        baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
      })
        .then((res) => {
          const quorumBlock: QuorumBlock = res.data as QuorumBlock;
          const currentBlock = parseInt(quorumBlock.number, 16);
          setTotal(currentBlock);
          const lastXBlockArray = range(
            currentBlock,
            currentBlock - lookBackBlocks,
            -1
          );
          const returns = lastXBlockArray.map(async (block) => {
            const res = await axios({
              method: "POST",
              url: `/api/blockGetByNumber`,
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                rpcUrl: needle.rpcUrl,
                blockNumber: "0x" + block.toString(16),
              }),
              signal: controller.signal,
              baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
              // timeout: 2000,
            });
            return res.data;
          });
          Promise.all(returns).then((values: QuorumBlock[]) => {
            const slicedBlocks = values;
            const slicedTxns = values
              .filter((a) => a.transactions.length > 0)
              .map((a) => a.transactions)
              .flat();
            console.log(slicedBlocks);
            setExplorer({
              selectedNode: name,
              blocks: slicedBlocks,
              transactions: slicedTxns,
            });
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, lookBackBlocks, isPaused]
  );

  const startInterval = () => {

    intervalRef.current = setInterval(() => {
      if (isPausedRef.current !== true) {
        if (blocksRef?.current) {
          if (Math.ceil((totalRef.current - parseInt(blocksRef?.current[blocksRef?.current.length - 1]?.number, 16)) / blocksRef?.current.length) <= 1) {
            nodeInfoHandler(explorer.selectedNode);
            console.log("explorer > called for new info...");
          } else {
            console.log('blocksRef.current?.number', parseInt(blocksRef.current[0]?.number, 16))
            getNextRecords(Number(parseInt(blocksRef.current[0]?.number, 16)), blocksRef.current.length)
          }
        }
      }
    }, refresh5s);

    totalIntervalId.current = setInterval(async () => {
      if (Math.ceil((totalRef.current - parseInt(blocksRef.current[blocksRef.current.length - 1]?.number, 16)) / blocksRef.current.length) > 1) {
        let t = await getLatestBlockNumber();
        setTotal(Number(t));
      }
    }, refresh5s);
  }

  useEffect(() => {
    nodeInfoHandler(explorer.selectedNode);

    startInterval();
    return () => {
      clearInterval(intervalRef?.current as NodeJS.Timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explorer.selectedNode, lookBackBlocks]);

  // use useCallBack
  const getNextRecords = useCallback(
    async (blockNumber: any, limit: any, refreshInterval = false) => {

      if (refreshInterval) {
        clearInterval(intervalRef?.current as NodeJS.Timeout);
        clearInterval(totalIntervalId.current as NodeJS.Timeout);
      }
      let name = explorer.selectedNode;

      blockNumber = Math.min(Number(blockNumber), Number(totalRef.current));
      if (isPaused === true) {
        return;
      }
      const needle: QuorumNode = getDetailsByNodeName(config, name);
      try {
        // const quorumBlock: QuorumBlock = prevBlocks[prevBlocks.length - 1] as QuorumBlock;
        const currentBlock = Number(blockNumber);
        console.log('blockNumber, limit', blockNumber, limit, currentBlock,
          currentBlock - (limit ? Number(limit) : Number(lookBackBlocks)))
        const lastXBlockArray = range(
          currentBlock,
          currentBlock - (limit ? Number(limit) : Number(lookBackBlocks)),
          -1
        );
        console.log('lastXBlockArray', lastXBlockArray)
        const returns = lastXBlockArray.map(async (block) => {
          const res = await axios({
            method: "POST",
            url: `/api/blockGetByNumber`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              rpcUrl: needle.rpcUrl,
              blockNumber: "0x" + block.toString(16),
            }),
            signal: controller.signal,
            baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
            timeout: 10000,
          });
          return res.data;
        });
        Promise.all(returns).then((values: QuorumBlock[]) => {
          const slicedBlocks = values;
          const slicedTxns = values
            .map((a) => a.transactions)
            .flat();
          // console.log(slicedBlocks);

          console.log('aa-aa', slicedBlocks);
          let newVal = {
            selectedNode: name,
            blocks: slicedBlocks,
            transactions: slicedTxns,
          }
          console.log('aa-aa', newVal);
          setExplorer(newVal);
          if (refreshInterval) {
            startInterval();
          }
        });
      }
      catch (err) {
        console.error(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, lookBackBlocks, isPaused, total]
  );

  const handleSelectNode = (e: any) => {
    controller.abort();
    clearInterval(intervalRef.current as NodeJS.Timeout);
    clearInterval(totalIntervalId.current as NodeJS.Timeout);
    setExplorer({ ...explorer, selectedNode: e.target.value });
  };


  const getLatestBlockNumber = async () => await axios({
    method: "POST",
    url: `/api/blockGetByNumber`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      rpcUrl: getDetailsByNodeName(config, explorer.selectedNode).rpcUrl,
      blockNumber: "latest",
    }),
    baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
    timeout: 10000,
  }).then((response) => {
    return parseInt(response.data.number, 16)
  }).catch((err) => {
    console.log(err);
  })

  useEffect(() => {

    return () => {
      clearInterval(totalIntervalId.current);
    }
  }, [explorer.selectedNode])




  if (typeof window !== "undefined" && loading) return null;
  if (!session && publicRuntimeConfig.DISABLE_AUTH === "false") {
    return <AccessDenied />;
  }

  return (
    <>
      <Container maxW={{ base: "container.sm", md: "container.xl" }} p={0}>
        <PageHeader
          title="Explorer"
          config={config}
          selectNodeHandler={handleSelectNode}
        />
        <ExplorerBlocks
          blocks={explorer.blocks}
          url={getDetailsByNodeName(config, explorer.selectedNode).rpcUrl}
          onSelectChange={onSelectChange}
          setIsPaused={setIsPaused}
          getNextRecords={getNextRecords}
          lookBackBlocks={lookBackBlocks}
          total={total}
          abort={() => {
            console.log('abort')
            controller.abort()
          }}
        />
        <Divider />
        <ExplorerTxns
          txns={explorer.transactions}
          url={getDetailsByNodeName(config, explorer.selectedNode).rpcUrl}
        />
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const res = await configReader();
  const config: QuorumConfig = JSON.parse(res);
  return {
    props: {
      config,
      session: await getSession(context),
    },
  };
};
