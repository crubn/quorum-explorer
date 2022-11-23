
import { IconButton, InputGroup, InputLeftElement, Select, Tooltip } from "@chakra-ui/react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faLongArrowAltDown, faLongArrowAltUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { camelCaseToString } from "../../Helpers";
interface IProps {
    sortOrder: any;
    setSortOrder: any;
    sortOrderBy: any;
    setSortOrderBy: any;
    options: any;
}
export default function SortDropdown(props: IProps) {
    console.log(props)
    const { sortOrder, setSortOrder, sortOrderBy, setSortOrderBy, options } = props;


    return (
        <InputGroup width="190px"
            border="1px solid #CBD5E0"
            borderRadius="var(--chakra-radii-md)">

            <Tooltip label="Toggle sorting order">
                <InputLeftElement
                    marginLeft="2px"
                >
                    {sortOrder > 0 ? <IconButton
                        backgroundColor="#ffffff"
                        height="36px"
                        onClick={() => setSortOrder(-1)}
                        aria-label={""}>
                        <FontAwesomeIcon
                            icon={faLongArrowAltUp as IconProp} />
                    </IconButton> :
                        <IconButton
                            backgroundColor="#ffffff"
                            height="36px"
                            onClick={() => setSortOrder(1)}
                            aria-label={""}>
                            <FontAwesomeIcon
                                icon={faLongArrowAltDown as IconProp} />
                        </IconButton>}
                </InputLeftElement>
            </Tooltip>


            <Select
                focusBorderColor="none"
                border="none !important"
                outline="0 !important"
                marginLeft="30px"
                placeholder='Select option'
                value={sortOrderBy}
                onChange={(e) => setSortOrderBy(e.target.value)}>{
                    options.map((option: any, i: number) => <option
                        key={option + "-" + i}
                        value={option}>
                        {camelCaseToString(option)}
                    </option>)
                }
            </Select>
        </InputGroup>
    )
}
