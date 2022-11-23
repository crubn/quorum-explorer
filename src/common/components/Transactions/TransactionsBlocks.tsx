import {
  Box, Container, Flex,
  FormControl, Input, Select, SimpleGrid,
  Tag,
  TagLabel,
  Text, Tooltip, useToast
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import getConfig from "next/config";
import React, { useState } from "react";
import 'react-data-grid/lib/styles.css';
import { copyToClipboard } from "../../Helpers";
import { getTimeAgoNormal } from "../../lib/explorer";
import { QuorumTxn } from "../../types/Explorer";
import CustomTable from "../CustomTable";
import ExplorerTxnToast from "../Explorer/ExplorerTxnToast";
import SortDropdown from "../Misc/SortDropdown";
import TransactionDetails from "./TransactionDetails";

const { publicRuntimeConfig } = getConfig();

const BoxMotion = motion(Box);

interface IProps {
  blocks: any;
  onSelectChange: (e: any) => void;
  getNextRecords: any;
  total: any;
  seed: number;
  lookBackBlocks: number;
  url: string;
  sortOrder: any;
  setSortOrder: any;
  sortOrderBy: any;
  setSortOrderBy: any;
  search: any;
  setSearch: any;
}

export default function TransactionsBlocks({
  blocks,
  onSelectChange,
  getNextRecords,
  total,
  seed,
  lookBackBlocks,
  url,
  sortOrder, setSortOrder,
  sortOrderBy, setSortOrderBy,
  search, setSearch
}: IProps) {


  const [transactionSearch, setTransactionSearch] = useState("");
  const [searchByBlockNumber, setSearchByBlockNumber] = useState('');
  const toast = useToast();
  const toastIdRef: any = React.useRef();
  const gridRef: any = React.useRef();

  const closeToast = () => {
    setTransactionSearch
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  };


  const onChange = (e: any) => {
    setTransactionSearch(e.target.value);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const res = await axios({
      method: "POST",
      url: `/api/txnGetByHash`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        rpcUrl: url,
        txnHash: transactionSearch,
      }),
      baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
    });
    var txn: QuorumTxn = res.data as QuorumTxn;
    toastIdRef.current = toast({
      position: "top-right",
      isClosable: true,
      duration: 10000,
      containerStyle: {
        width: "600px",
        maxWidth: "100%",
      },
      render: () => <ExplorerTxnToast txn={txn} closeToast={closeToast} />,
    });
  };

  const columns = [
    { key: 'bNo', name: 'Block Number', width: "10%" },
    { key: 'hashComponent', name: 'Transaction Hash', width: "32%" },
    { key: 'contractDeployment', name: 'Type', width: "15%" },
    { key: 'nonceX', name: 'Nonce', width: "15%" },
    { key: 'createdTime', name: 'Created At', width: "15%" },
    { key: 'showDetails', name: 'More Info', width: "10%" },
  ];

  const TableComponent = () => {
    return (<CustomTable gridRef={gridRef}
      columns={columns}
      rows={blocks.map((block: any) => ({
        ...block,
        // bNo: parseInt(block.blockNumber, 16),
        nonceX: parseInt(block.nonce, 16),
        createdTime: getTimeAgoNormal(block.createdAt),
        contractDeployment: block.to ? (<Tag
          size='md'
          borderRadius='full'
          margin='8px'
          variant='solid'
          className="company_color"
        >
          <TagLabel>Transaction</TagLabel>
        </Tag>) : (<Tag
          size='md'
          borderRadius='full'
          margin='8px'
          variant='solid'
          colorScheme='green'
        >
          <TagLabel>Contract Deployment</TagLabel>
        </Tag>),
        showDetails: (<TransactionDetails txn={block} />),
        hashComponent: (<Text isTruncated
          as="p"
          fontSize="sm"
          cursor="pointer"
          onClick={() => copyToClipboard(block.hash).then(() => {
            toast({
              title: 'Transaction hash copied',
              status: 'success',
              duration: 9000,
              isClosable: true,
              position: "top"
            })
          })
          }
        > {block.hash}</Text>)
      }))}
      // onScroll={handleScroll}
      rowKeyGetter={(r: any) => {
        return r.hash;
      }}
      className="rdg-light"
      rowHeight={40}
      style={{
        width: '100%',
        // overflowX: 'hidden'
      }}
      start={seed + 1}
      end={seed + blocks.length}
      total={total}
      rowsPerPage={lookBackBlocks}
      getNextRecords={getNextRecords}
      paginationDirectionForward
    />)
  }
  const MemoizedTableComponent = React.memo(TableComponent);


  return (
    <>
      <BoxMotion
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        as="section"
        py="16px"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
          mb={6}
          mx="16px"
        >
          <Text as="b" fontSize="lg">
            Blocks
          </Text>
          <Container maxW="100%" m={0} p={0}>
            <Flex justifyContent="flex-end" gap="16px">
              <Tooltip label="Select number of blocks back to display data">
                <Select maxW="80px" onChange={onSelectChange}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
              </Tooltip>
              <FormControl as="form" onSubmit={onSubmit} maxW="225px">
                <Input
                  placeholder={"Search by transaction hash"}
                  onInput={onChange}
                  onSubmit={onSubmit}
                />
              </FormControl>
              <Input
                placeholder={"Search by block number"}
                value={searchByBlockNumber}
                onChange={(e: any) => {
                  setSearchByBlockNumber(e.target.value)
                  if (e.target.value) {
                    let searchAr = ['blockNumber', "0x" +
                      Number(e.target.value).toString(16)];
                    setSearch(searchAr)
                    getNextRecords(undefined, undefined, searchAr)
                  } else {
                    getNextRecords()
                  }

                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (searchByBlockNumber) {
                      let searchAr = ['blockNumber', "0x" +
                        Number(searchByBlockNumber).toString(16)];
                      setSearch(searchAr)
                      getNextRecords(undefined, undefined, searchAr)
                    }
                    else {
                      getNextRecords(undefined, undefined, ["", ""])
                    }
                  }
                }}
                width="210px"
              />
              <SortDropdown
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setSortOrderBy={setSortOrderBy}
                sortOrderBy={sortOrderBy}
                options={["hash", "blockNumber", "nonce", "createdAt"]}
              />
            </Flex>
          </Container>
        </Flex>
        <Container maxW={{ base: "container.sm", md: "container.xl" }}>
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={{ base: "5", md: "6" }}>
            {/* <>
              {blocks.map((block, i) => (
                <ExplorerBlockCard
                  key={i}
                  block={block}
                  setIsPaused={setIsPaused}
                />
              ))}
            </> */}
          </SimpleGrid>
          <MemoizedTableComponent />
        </Container>
      </BoxMotion>
    </>
  );
}
