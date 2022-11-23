import { Box, IconButton, Text } from '@chakra-ui/react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

export default function CustomTable(props: any) {
    const { gridRef, rows, start, end, total, rowsPerPage, getNextRecords, paginationDirectionForward = false } = props;
    return (
        <>
            <DataGrid {...props}
                ref={gridRef}
                rowHeight={40}
                className="rdg-light"
                style={{
                    width: '100%',
                    height: "440px"
                    // overflowX: 'hidden'
                }} />

            <Box display="flex" alignItems="center" justifyContent="flex-end"
                margin="1em">
                <Text fontSize='sm'>{start} - {end} of {total}</Text>
                <IconButton
                    onClick={() => {
                        if (paginationDirectionForward) {
                            getNextRecords(0, rowsPerPage, true)
                        } else {
                            getNextRecords(total, rowsPerPage, true)
                        }
                    }}
                    className="fa-icon-css" aria-label='Search database' icon={<FontAwesomeIcon
                        icon={faAngleDoubleLeft as IconProp} />} />
                <IconButton
                    onClick={() => {
                        if (paginationDirectionForward) {
                            getNextRecords(Math.max((start - rowsPerPage - 1), 0), rowsPerPage, true)
                        } else {
                            getNextRecords(Math.min((start + rowsPerPage), total), rowsPerPage, true)
                        }
                    }
                    }
                    className="fa-icon-css" aria-label='Search database' icon={<FontAwesomeIcon
                        icon={faAngleLeft as IconProp} />} />

                <Text fontSize='sm'>
                    Page {paginationDirectionForward ? Math.ceil((start) / rowsPerPage) : Math.ceil((total - end) / rowsPerPage)}
                    &nbsp;
                    of {Math.ceil(total / rowsPerPage)}
                </Text>

                <IconButton
                    onClick={() => {
                        if (paginationDirectionForward) {
                            getNextRecords(end, rowsPerPage, true)
                        } else {
                            getNextRecords(end - 1, rowsPerPage, true)
                        }
                    }
                    }
                    className="fa-icon-css" aria-label='Search database' icon={<FontAwesomeIcon
                        icon={faAngleRight as IconProp} />} />
                <IconButton
                    onClick={() => {
                        if (paginationDirectionForward) {
                            getNextRecords(total - (total % rowsPerPage), rowsPerPage, true)
                        } else {
                            getNextRecords(rowsPerPage, rowsPerPage, true)
                        }
                    }}
                    className="fa-icon-css" aria-label='Search database' icon={<FontAwesomeIcon
                        icon={faAngleDoubleRight as IconProp} />} />
            </Box>
        </>


    )
}
