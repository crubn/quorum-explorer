import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Text } from "@chakra-ui/react";
import { camelCaseToString } from "../../Helpers";
interface IProps {
    ar: any;
    titlePropName: string;
    bodyBackgroundColor?: any;
    headerBackgroundColor?: any;
}
export default function TreeView(props: IProps) {
    console.log(props)

    return (
        <Accordion allowMultiple backgroundColor={props.bodyBackgroundColor || "#ffffff"}
            width="100%" overflowWrap="anywhere"
            color={props.bodyBackgroundColor ? "#ffffff" : "#000000"}>
            {props.ar.map((item: any, i: number) =>
            (<AccordionItem key={item[props.titlePropName] + i} border="none">
                <AccordionButton wordBreak="break-all"
                    boxShadow="none !important"
                    backgroundColor={props.headerBackgroundColor || "#ffffff"}>
                    <Text fontSize="xs" textAlign='left'>
                        {(i + 1) + ". " + item[props.titlePropName]}
                    </Text>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel p={4} width="100%" overflowWrap="anywhere">
                    <ul style={{ margin: "0 1em" }}>{Object.keys(item).map((nested, j) => <li
                        key={nested + i + "-" + j}
                        style={{ width: "100%", overflowWrap: "anywhere" }}>
                        <strong>{camelCaseToString(nested)}: </strong>
                        {item[nested]}
                    </li>)}</ul>

                </AccordionPanel>
            </AccordionItem>)
            )}
        </Accordion>
    )
}
