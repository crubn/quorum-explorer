import {
  Container,
  Flex, Table,
  TableCaption, TableContainer, Tbody,
  Td, Text, Th, Thead, Tooltip, Tr, useToast
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { copyToClipboard } from "../../Helpers";

const MotionContainer = motion(Container);
const MotionText = motion(Text);

interface IProps {
  peers: any;
  ip: string;
}

export default function NodePeers({ ip, peers }: IProps) {
  const toast = useToast();
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
              <TableCaption placement="top">Current Node And Its Peers</TableCaption>
              <Thead>
                <Tr>
                  <Th width="20%">
                    Org ID
                  </Th>
                  <Th width="20%">
                    IP Address
                  </Th>
                  <Th width="60%">
                    ENODE URL
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
                    <Tr key={peer.url}>
                      <Td>
                        <Tooltip label={peer.orgId} placement="auto">
                          <MotionText
                            key={peer.orgId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            end={{ opacity: 0 }}
                            isTruncated
                            fontWeight={peer.ipAddress === ip ? 'bold' : 'inherit'}
                          >
                            {peer.orgId}
                          </MotionText>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip label={peer.ipAddress} placement="auto">
                          <MotionText
                            key={peer.ipAddress}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            end={{ opacity: 0 }}
                            isTruncated
                            fontWeight={peer.ipAddress === ip ? 'bold' : 'inherit'}
                          >
                            {peer.ipAddress}
                          </MotionText>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip label={peer.url + " (click to copy)"} placement="auto">
                          <MotionText
                            key={peer.url}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            end={{ opacity: 0 }}
                            isTruncated
                            cursor="pointer"
                            fontWeight={peer.ipAddress === ip ? 'bold' : 'inherit'}
                            onClick={() => copyToClipboard(peer.url)
                              .then(() => {
                                toast({
                                  title: 'Peer URL copied',
                                  status: 'success',
                                  duration: 2000,
                                  isClosable: true,
                                  position: "top"
                                })
                              })
                            }
                          >
                            {peer.url}
                          </MotionText>
                        </Tooltip>
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
