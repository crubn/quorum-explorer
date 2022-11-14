import { Container } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import getConfig from "next/config";
import { useCallback, useEffect, useState } from "react";
import AccessDenied from "../common/components/Misc/AccessDenied";
import PageHeader from "../common/components/Misc/PageHeader";
import { configReader } from "../common/lib/getConfig";
import { getDetailsByNodeName } from "../common/lib/quorumConfig";
import { QuorumBlock, QuorumTxn } from "../common/types/Explorer";
import { QuorumConfig, QuorumNode } from "../common/types/QuorumConfig";
const { publicRuntimeConfig } = getConfig();

import axios from "axios";
import TransactionsBlocks from "../common/components/Transactions/TransactionsBlocks";

interface IState {
  selectedNode: string;
  blocks: QuorumBlock[];
  transactions: QuorumTxn[];
}

interface IProps {
  config: QuorumConfig;
}

export default function Transaction({ config }: IProps) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const controller = new AbortController();
  const [transactions, setTransactions] = useState<any>([]);
  const [selectedNode, setSelectedNode] = useState<any>(config.nodes[0].name);
  const [lookBackBlocks, setLookBackBlocks] = useState(10);
  const [total, setTotal] = useState(0);
  const [seed, setSeed] = useState(0);

  const [sortOrder, setSortOrder] = useState(-1);
  const [sortOrderBy, setSortOrderBy] = useState("createdAt");
  const [searchX, setSearchX] = useState('');

  const onSelectChange = (e: any) => {
    e.preventDefault();
    setLookBackBlocks(e.target.value);
  };

  // use useCallBack
  const nodeInfoHandler = useCallback(
    async (x: any = seed, limit: any = lookBackBlocks, search: any = searchX, sort: any = [sortOrder, sortOrderBy]) => {
      console.log('seed', x, Number(total), (x !== 0 && total !== 0), x >= Number(total))
      if ((x !== 0 && total !== 0) && x >= Number(total)) {
        return;
      }
      const needle: QuorumNode = getDetailsByNodeName(config, selectedNode);
      let str = "";
      if (search.length > 1) {
        str += "&searchBy=" + search[0] + "&searchValue=" + search[1]
      }
      if (sort.length > 1) {
        str += "&sortOrder=" + sort[0] + "&sortBy=" + ((sortOrderBy === "blockNumber") ? "bNo" : sort[1])
      }
      console.log('str', str)
      axios({
        method: "GET",
        url: `/api/getTransactions?node=${needle.name}&seed=${x}&limit=${limit}${str}`,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
        signal: controller.signal,
        baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
      })
        .then((res) => {
          console.log('Transactions', res)
          if (res?.data?.code === 0) {
            setSeed(x)
            setTransactions(res?.data?.data.list)
            setTotal(res?.data?.data?.total)
          } else {
            console.log(res?.data)
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, lookBackBlocks, total, searchX, sortOrder, sortOrderBy]
  );

  useEffect(() => {
    nodeInfoHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookBackBlocks, sortOrder, sortOrderBy]);


  const handleSelectNode = (e: any) => {
    controller.abort();
    setSelectedNode(e.target.value);
  };

  if (typeof window !== "undefined" && loading) return null;
  if (!session && publicRuntimeConfig.DISABLE_AUTH === "false") {
    return <AccessDenied />;
  }

  return (
    <>
      <Container maxW={{ base: "container.sm", md: "container.xl" }} p={0}>
        <PageHeader
          title="Transactions"
          config={config}
          selectNodeHandler={handleSelectNode}
        />
        <TransactionsBlocks
          blocks={transactions}
          onSelectChange={onSelectChange}
          getNextRecords={nodeInfoHandler}
          total={total}
          seed={seed}
          lookBackBlocks={lookBackBlocks}
          url={getDetailsByNodeName(config, selectedNode).rpcUrl}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          sortOrderBy={sortOrderBy}
          setSortOrderBy={setSortOrderBy}
          search={searchX}
          setSearch={setSearchX}
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
