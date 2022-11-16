import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { QuorumTxn } from "../../types/Explorer";

interface IProps {
  txn: QuorumTxn;
}

export default function ExplorerTxnDetails({ txn }: IProps) {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button p={0} m={0}>
            <FontAwesomeIcon icon={faExpand as IconProp} />
          </Button>
        </PopoverTrigger>
        <PopoverContent width="80vw">
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Txn: {txn.hash}</PopoverHeader>
          <PopoverBody>
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
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
