import {
    Box, Divider, Table, Tbody, Td, Tr
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import 'react-data-grid/lib/styles.css';
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
    const [txnData, setTxnData] = useState<any>(null);
    const [explorer, setExplorer] = useState<IState>({
        selectedNode: config.nodes[0].name,
    });
    const router = useRouter()
    const { transactionHash } = router.query


    const fetchTxnDataByHash = useCallback(async (txnHash: any, node = explorer.selectedNode) => {
        
        const needle: QuorumNode = getDetailsByNodeName(config, node);
        console.log('node', node, needle)
        if (txnHash) {
            const res = await axios({
                method: "POST",
                url: `/api/txnGetByHash`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    rpcUrl: needle.rpcUrl,
                    txnHash: txnHash,
                }),
                baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
            });


            var txn: QuorumBlock = res.data as QuorumBlock;
            console.log("txn", txn)
            setTxnData(txn)
        }
    }, [explorer.selectedNode, config]);

    useEffect(() => {
        if (transactionHash && transactionHash.length > 0) {
            fetchTxnDataByHash(transactionHash)
        }

        return () => {
            setTxnData(null)
        }
    }, [transactionHash, fetchTxnDataByHash])

    const handleSelectNode = (e: any) => {
        setExplorer({ ...explorer, selectedNode: e.target.value });
        // fetchTxnDataByHash(transactionHash, e.target.value)
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
                    title={'Transaction'}
                    config={config}
                    selectNodeHandler={handleSelectNode}
                />
                {txnData ? <Box color="#000000" p={3} width="85%" margin="0 auto">

                    <Divider my={4} />
                    <Table size="sm">
                        <Tbody>
                            <Tr fontSize="sm">
                                <Td width="20%" fontWeight="bold" borderBottomColor={"#d6d6d6"}>TxnHash</Td>
                                <Td width="80%" borderBottomColor={"#d6d6d6"}>{txnData.hash} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>BlockHash</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.blockHash} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>BlockNumber</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.blockNumber} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>From</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.from} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Gas Used</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.gas}</Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>GasPrice</Td>
                                <Td borderBottomColor={"#d6d6d6"}>
                                    {txnData.gasPrice}
                                </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Input</Td>
                                <Td width="80%" borderBottomColor={"#d6d6d6"} overflowWrap="anywhere">{txnData.input} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>To</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.to} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Transaction Index</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.transactionIndex} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>Value</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.value} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>R</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.r} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>S</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.s} </Td>
                            </Tr>
                            <Tr fontSize="sm">
                                <Td fontWeight="bold" borderBottomColor={"#d6d6d6"}>V</Td>
                                <Td borderBottomColor={"#d6d6d6"}>{txnData.v} </Td>
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
