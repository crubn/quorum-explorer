import {
  Button, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalHeader, Text
} from "@chakra-ui/react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { QuorumTxn } from "../../types/Explorer";

interface IProps {
  txn: QuorumTxn;
}

export default function ExplorerTxnDetails({ txn }: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button p={0} m={0}
        onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={faExpand as IconProp} />
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}
        size="4xl">

        <ModalContent width="80vw">

          <ModalCloseButton />
          <ModalHeader>Txn: {txn.hash}</ModalHeader>
          <ModalBody>
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
        </ModalContent>
      </Modal>
    </>
  );
}
