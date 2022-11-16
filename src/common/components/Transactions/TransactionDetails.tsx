import {
  Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text,
  useDisclosure
} from "@chakra-ui/react";
import { QuorumTxn } from "../../types/Explorer";

interface IProps {
  txn: QuorumTxn;
}

export default function TransactionDetails({ txn }: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const openModal = () => {
    onOpen();
  };
  const closeModal = () => {
    onClose();
  };

  return (
    <>
      <Button p={0} m={1} onClick={openModal} aria-label={""} height="30px" width="100%">
        Show
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="2xl"
        closeOnOverlayClick={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Text fontSize="xs" textAlign="left">
              Transaction Hash:&nbsp; {txn.hash}
            </Text>
          <Text fontSize="xs" textAlign="left">
              Block Number:&nbsp; {txn.blockNumber}
            </Text>
            <Text fontSize="xs" textAlign="left">
              Block Hash:&nbsp; {txn.blockHash}
            </Text>
            <Text fontSize="xs" textAlign="left">
              From:&nbsp; {txn.from}
            </Text>
            <Text fontSize="xs" textAlign="left">
              To:&nbsp; {txn.to}
            </Text>
            <Text fontSize="xs" textAlign="left">
              Input:&nbsp; {txn.input}
            </Text>
            <Text fontSize="xs" textAlign="left">
              Nonce:&nbsp; {txn.nonce}
            </Text>
            <Text fontSize="xs" textAlign="left">
              Txn Index:&nbsp; {txn.transactionIndex}
            </Text>
            <Text fontSize="xs" textAlign="left">
              R:&nbsp; {txn.r}
            </Text>
            <Text fontSize="xs" textAlign="left">
              S:&nbsp; {txn.s}
            </Text>
            <Text fontSize="xs" textAlign="left">
              V:&nbsp; {txn.v}
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
