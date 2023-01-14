import {
  Center, Container,
  Flex, Table,
  TableCaption, TableContainer, Tbody,
  Td, Text, Th, Thead, Tooltip, Tr
} from "@chakra-ui/react";
import { motion } from "framer-motion";
const MotionContainer = motion(Container);
const MotionText = motion(Text);

interface IProps {
  peers: any;
}

export default function NodePeers({ peers }: IProps) {
  return (
    <>
      <MotionContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        maxW={{ base: "container.sm", md: "container.xl" }}
        mt={10}
      >
        <Flex
          id="peers"
          flexDirection="column"
          borderRadius="lg"
          borderWidth={2}
          boxShadow="lg"
        >
          <TableContainer>
            <Table variant="simple" style={{ tableLayout: "fixed" }}>
              <TableCaption placement="top">Peer Information</TableCaption>
              <Thead>
                <Tr>
                  <Th>
                    <Center>Org ID</Center>
                  </Th>
                  <Th>
                    <Center>Ultimate Parent</Center>
                  </Th>
                  <Th>
                    <Center>ENODE URL</Center>
                  </Th>
                  {/* <Th>
                    <Center>Org ID</Center>
                  </Th>
                  <Th>
                    <Center>Remote-Address</Center>
                  </Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {peers.map((peer: any) => {
                  return (
                      <Tr key={peer.orgId}>
                        <Td>
                          <Center>
                            <Tooltip label={peer.orgId} placement="auto">
                              <MotionText
                                key={peer.orgId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                end={{ opacity: 0 }}
                                isTruncated
                              >
                                {peer.orgId}
                              </MotionText>
                            </Tooltip>
                          </Center>
                        </Td>
                        <Td>
                          <Center>
                            <Tooltip label={peer.ultimateParent} placement="auto">
                              <MotionText
                                key={peer.ultimateParent}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                end={{ opacity: 0 }}
                                isTruncated
                              >
                                {peer.ultimateParent}
                              </MotionText>
                            </Tooltip>
                          </Center>
                        </Td>
                        <Td>
                          <Center>
                            <Tooltip label={peer.url} placement="auto">
                              <MotionText
                                key={peer.url}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                end={{ opacity: 0 }}
                                isTruncated
                              >
                                {peer.url}
                              </MotionText>
                            </Tooltip>
                          </Center>
                        </Td>
                        {/* <Td>
                          <Center>
                            <Tooltip label={peer.orgId} placement="auto">
                              <MotionText
                                key={peer.orgId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                end={{ opacity: 0 }}
                                isTruncated
                              >
                                {peer.orgId}
                              </MotionText>
                            </Tooltip>
                          </Center>
                        </Td>
                        <Td>
                          <Center>
                            <Tooltip
                              label={peer.remoteAddress}
                              placement="auto"
                            >
                              <MotionText
                                key={peer.remoteAddress}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                end={{ opacity: 0 }}
                                isTruncated
                              >
                                {peer.remoteAddress}
                              </MotionText>
                            </Tooltip>
                          </Center>
                        </Td> */}
                      </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </MotionContainer>
    </>
  );
}
