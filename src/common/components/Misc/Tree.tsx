import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from "@chakra-ui/react";
import { camelCaseToString } from "../../Helpers";
interface IProps {
    ar: object[];
    titlePropName: string;
}
export default function TreeView(props: IProps) {
    console.log(props)
    return (
        <Accordion allowMultiple backgroundColor="#0f41d8" width="100%" overflowWrap="anywhere" >
            {props.ar.map((item: any, i: number) =>
            (<AccordionItem key={item[props.titlePropName] + i} border="none">
                <AccordionButton wordBreak="break-all" backgroundColor="#0033cc">
                    <Box flex='1' textAlign='left'>
                        {item[props.titlePropName]}
                    </Box>
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
