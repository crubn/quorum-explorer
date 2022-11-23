import {
  Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text,
  useDisclosure
} from "@chakra-ui/react";
import { QuorumBlock } from "../../types/Explorer";
import TreeView from "../Misc/Tree";

interface IProps {
  block: QuorumBlock;
  setIsPaused: any;
}

export default function ExplorerBlockDetails({ block, setIsPaused }: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const openModal = () => {
    setIsPaused(true);
    onOpen();
  };
  const closeModal = () => {
    setIsPaused(false);
    onClose();
  };

  console.log(parseInt(block.number, 16), block)
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
          <ModalHeader>Block Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="xs" isTruncated textAlign="left">
              Block: {parseInt(block.number, 16)}
            </Text>{" "}
            <Text fontSize="xs" isTruncated textAlign="left">
              Miner: {block.miner}
            </Text>
            <Text fontSize="xs" isTruncated textAlign="left">
              Hash: {block.hash}
            </Text>
            <Text fontSize="xs" isTruncated textAlign="left">
              Transactions: {block.transactions.length}
            </Text>
            <Text fontSize="xs" isTruncated textAlign="left">
              Timestamp: {new Date(parseInt(block.timestamp, 16)).toString()}
            </Text>
            <Text fontSize="xs" isTruncated textAlign="left">
              State Root: {block.stateRoot}
            </Text>
            <Text fontSize="xs" isTruncated textAlign="left">
              Receipt Root: {block.receiptsRoot}
            </Text>
            {block.transactions.length ? <Text fontSize="xs" textAlign="left">
              Transaction Hashes: <TreeView ar={block.transactions} titlePropName="hash" />
            </Text> : null}
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
