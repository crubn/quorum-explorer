import {
  Button,
  Container,
  Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table,
  TableCaption, TableContainer, Tbody,
  Td, Text, Th, Thead, Tooltip, Tr, useDisclosure, useToast
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import getConfig from "next/config";
import { useEffect, useState } from "react";

const { publicRuntimeConfig } = getConfig();
const MotionContainer = motion(Container);
const MotionText = motion(Text);

interface IProps {
  peers: any;
  ip: string;
}

export default function NodePeers({ ip, peers }: IProps) {
  const toast = useToast();
  const [locations, setLocations] = useState<any>({})
  const [selectedPeer, setSelectedPeer] = useState<any>("")

  const { isOpen, onOpen, onClose } = useDisclosure();
  const openModal = (peerUrl:string) => {
    onOpen();
    setSelectedPeer(peerUrl)
  };
  const closeModal = () => {
    onClose();
    setSelectedPeer("")
  };

  useEffect(() => {
    const fn = async () => {
      let locationsTemp: any = {}
      for await (let peer of peers) {
        if (!location[peer.ipAddress]) {
          await axios({
            method: "GET",
            url: `/api/locationGetByIp?ip=${peer.ipAddress}`,
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000,
            baseURL: `${publicRuntimeConfig.QE_BASEPATH}`,
          })
            .then((res) => {
              console.log('Locations response', res)
              if (res?.data?.code === 0) {
                locationsTemp[peer.ipAddress] = res?.data?.data
              } else {
                console.log(res?.data)
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }

      setLocations(locationsTemp)
    };
    fn();
  }, [peers])

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
                  <Th width="40%">
                    Location
                  </Th>
                  <Th width="20%">
                    IP Address
                  </Th>
                  <Th width="20%">
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
                        <Tooltip label={locations[peer.ipAddress]} placement="auto">
                          <MotionText
                            key={locations[peer.ipAddress]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            end={{ opacity: 0 }}
                            isTruncated
                            fontWeight={peer.ipAddress === ip ? 'bold' : 'inherit'}
                          >
                            {locations[peer.ipAddress]}
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
                          <Button p={0} onClick={()=>openModal(peer.url)}
                            aria-label={""} height="30px" width="100%">
                            Show
                          </Button>
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

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="2xl"
        closeOnOverlayClick={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enode Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="xs" textAlign="left">
              {selectedPeer}
            </Text>
            </ModalBody>

          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
