import {
    Box, Divider, Table, Tbody, Td, Tr
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import 'react-data-grid/lib/styles.css';
import TreeView from "../../common/components/Misc/Tree";
import { getDetailsByNodeName } from "../../common/lib/quorumConfig";
import { QuorumNode } from "../../common/types/QuorumConfig";

import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import PageHeader from "../../common/components/Misc/PageHeader";
import { configReader } from "../../common/lib/getConfig";
import { QuorumBlock } from "../../common/types/Explorer";
import { QuorumConfig } from "../../common/types/QuorumConfig";
const { publicRuntimeConfig } = getConfig();

const BoxMotion = motion(Box);

interface IState {
    selectedNode: string;
}

interface IProps {
    url: string;
    onSelectChange: (e: any) => void;
    setIsPaused: any;
    getNextRecords: any;
    lookBackBlocks: any;
    config: any;
}


export default function ExplorerBlocks({
    url,
    config
}: IProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [blockData, setBlockData] = useState<any>(null);
    const [explorer, setExplorer] = useState<IState>({
        selectedNode: config.nodes[0].name,
    });
    const router = useRouter()
    const { blockParam } = router.query


    const fetchBlockDataByNumber = useCallback(async (bNo: any, node = explorer.selectedNode) => {
        const needle: QuorumNode = getDetailsByNodeName(config, node);

        const body: any = {
            rpcUrl: needle.rpcUrl
        }
        if (/[a-zA-Z]/.test(bNo)) {
            body.blockHash = bNo
        } else {
            body.blockNumber = "0x" + parseInt(bNo, 10).toString(16)
        }

        if (bNo) {
            const res = await axios({
                method: "POST",
                url: /[a-zA-Z]/.test(bNo) ? `/api/blockGetByHash` : `/api/blockGetByNumber`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(body),
                baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
                timeout: 10000,
            });
            var block: QuorumBlock = res.data as QuorumBlock;
            console.log("block", block)
            setBlockData(block)
        }
    }, [explorer, config]);

    useEffect(() => {
        if (blockParam && blockParam.length > 0) {
            fetchBlockDataByNumber(blockParam)
        }

        return () => {
            setBlockData(null)
        }
    }, [blockParam, fetchBlockDataByNumber])

    const handleSelectNode = (e: any) => {
        setExplorer({ ...explorer, selectedNode: e.target.value });
        // fetchBlockDataByNumber(blockParam, e.target.value)
    };
    return (
        <>
            <BoxMotion
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                as="section"
                py="16px"
            >
                <PageHeader
                    title={'Block: ' + (blockData?.number ? parseInt(blockData?.number, 16) : 'Loading')}
                    config={config}
                    selectNodeHandler={handleSelectNode}
                />
                {blockData ? <Box color="#000000" p={3} width="85%" margin="0 auto">

                    <Divider my={4} />
                    <Table size="sm">
                        <Tbody>
                            <Tr fontSize="sm">
                                <Td width="20%" fontWeight="bold" borderBottomColor={"#d6d6d6"}>Hash</Td>
                                <Td width="80%" borderBottomColor={"#d6d6d6"}>{blockData.hash} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Transactions</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{blockData.transactions.length} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Uncles</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{blockData.uncles.length} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Size</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{parseInt(blockData.size, 16)} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Gas Used</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{parseInt(blockData.gasUsed, 16)}</Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Timestamp</Td>
                                <Td borderBottomColor={"#d6d6d6"}>
                                    {new Date(parseInt(blockData.timestamp, 16)).toString()}
                                </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>State Root</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{blockData.stateRoot} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Receipt Root</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{blockData.receiptsRoot} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Txn Root</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{blockData.transactionsRoot} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Transaction Hashes</Td>
                                <Td borderBottomColor={"#d6d6d6"}>
                                    <TreeView ar={blockData.transactions} titlePropName="hash"
                                        headerBackgroundColor="#eaeaea" />
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box> : null}
            </BoxMotion>
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
