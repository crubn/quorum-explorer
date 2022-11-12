import {
  Box,
  Button,
  Container, Flex,
  FormControl, Input, Select, SimpleGrid,
  Text, Tooltip, useToast
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import getConfig from "next/config";
import React, { useState } from "react";
import 'react-data-grid/lib/styles.css';
import { getTimeAgo } from "../../lib/explorer";
import { QuorumBlock } from "../../types/Explorer";
import CustomTable from "../CustomTable";
import ExplorerBlockDetails from "./ExplorerBlockDetails";
import ExplorerBlockToast from "./ExplorerBlockToast";

const { publicRuntimeConfig } = getConfig();

const BoxMotion = motion(Box);

interface IProps {
  blocks: QuorumBlock[];
  url: string;
  onSelectChange: (e: any) => void;
  setIsPaused: any;
  getNextRecords: any;
  lookBackBlocks: any;
  total: any;
}

export default function ExplorerBlocks({
  blocks,
  url,
  onSelectChange,
  setIsPaused,
  getNextRecords,
  lookBackBlocks,
  total
}: IProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [blockSearch, setBlockSearch] = useState("");
  const [scrollToRow, setScrollToRow] = useState('');
  const toast = useToast();
  const toastIdRef: any = React.useRef();
  const gridRef: any = React.useRef();

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  };

  const onChange = (e: any) => {
    setBlockSearch(e.target.value);
  };

  const onSubmit = async (e: any) => {
    if (Number(blockSearch) >= 0) {
      e.preventDefault();
      const res = await axios({
        method: "POST",
        url: `/api/blockGetByNumber`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          rpcUrl: url,
          blockNumber: "0x" + parseInt(blockSearch, 10).toString(16),
        }),
        baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
        timeout: 10000,
      });
      var block: QuorumBlock = res.data as QuorumBlock;
      toastIdRef.current = toast({
        position: "top-right",
        isClosable: true,
        duration: 10 * 60 * 1000,
        containerStyle: {
          width: "50vw",
          maxWidth: "100%",
          maxHeight: "90vh",
          overflow: "auto"
        },
        render: () => (
          <ExplorerBlockToast block={block} closeToast={closeToast} />
        ),
      });
    }
  };

  const columns = [
    { key: 'bNo', name: 'Block Number', width: "20%" },
    { key: 'transactionsNo', name: 'Transactions', width: "10%" },
    { key: 'validator', name: 'Validator', width: "38%" },
    { key: 'minedAt', name: 'Mined At', width: "20%" },
    { key: 'showDetails', name: 'More Info', width: "10%" },
  ];

  function isAtBottom({ currentTarget }: React.UIEvent<HTMLDivElement>): boolean {
    return currentTarget.scrollTop + 10 >= currentTarget.scrollHeight - currentTarget.clientHeight;
  }

  async function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (isLoading || !isAtBottom(event)) return;

    setIsLoading(true);

    const newRows = await getNextRecords(blocks);

    setIsLoading(false);
  }




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
          <Container maxW="40%" m={0} p={0}>
            <Flex justifyContent="flex-end" gap="16px">
              <Tooltip label="Select number of blocks back to display data">
                <Select maxW="20%" onChange={onSelectChange}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
              </Tooltip>
              <FormControl as="form" onSubmit={onSubmit} maxW="50%">
                <Input
                  placeholder={"Search by block number"}
                  onInput={onChange}
                  onSubmit={onSubmit}
                />
              </FormControl>
              <Input
                placeholder={"Go to block number"}
                value={scrollToRow}
                onChange={(e: any) => {
                  setScrollToRow(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (Number(scrollToRow) < parseInt(blocks[0].number, 16)
                      && Number(scrollToRow) > parseInt(blocks[blocks.length - 1]?.number, 16)) {
                      let index = parseInt(blocks[0].number, 16) - Number(scrollToRow)
                      gridRef.current!.scrollToRow(index)
                      console.log('scrolling to:', index)
                    } else {
                      getNextRecords(scrollToRow, blocks.length, true)
                      gridRef.current!.scrollToRow(0)
                    }
                  }
                }}
              />
              <Button
                onClick={(e: any) => {
                  if (Number(scrollToRow) < parseInt(blocks[0].number, 16)
                    && Number(scrollToRow) > parseInt(blocks[blocks.length - 1]?.number, 16)) {
                    let index = parseInt(blocks[0].number, 16) - Number(scrollToRow)
                    gridRef.current!.scrollToRow(index)
                    console.log('scrolling to:', index)
                  } else {
                    getNextRecords(scrollToRow, blocks.length, true)
                    gridRef.current!.scrollToRow(0)
                  }
                }}>Go</Button>
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
          <CustomTable gridRef={gridRef}
            columns={columns}
            rows={blocks.map(block => ({
              ...block,
              bNo: parseInt(block.number, 16),
              transactionsNo: block.transactions.length,
              minedAt: getTimeAgo(block.timestamp),
              validator: block.miner,
              showDetails: (<ExplorerBlockDetails block={block} setIsPaused={setIsPaused} />)
            }))}
            // onScroll={handleScroll}
            rowKeyGetter={(r: any) => {
              return parseInt(r.number, 16);
            }}
            className="rdg-light"
            rowHeight={40}
            style={{
              width: '100%',
              // overflowX: 'hidden'
            }}
            start={parseInt(blocks[0]?.number, 16)}
            end={parseInt(blocks[blocks.length - 1]?.number, 16)}
            total={total}
            rowsPerPage={blocks.length}
            getNextRecords={getNextRecords}
          />
        </Container>
      </BoxMotion>
    </>
  );
}
