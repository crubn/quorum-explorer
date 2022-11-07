import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

export default function CustomTable(props: any) {
    const { gridRef, rows, start, end, total, rowsPerPage, getNextRecords } = props;
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
                    onClick={() => getNextRecords(total, rowsPerPage, true)}
                    className="fa-icon-css" aria-label='Search database' icon={<FontAwesomeIcon
                        icon={faAngleDoubleLeft as IconProp} />} />
                <IconButton
                    onClick={() => getNextRecords(Math.min((start + rowsPerPage), total), rowsPerPage, true)}
                    className="fa-icon-css" aria-label='Search database' icon={<FontAwesomeIcon
                        icon={faAngleLeft as IconProp} />} />

                <Text fontSize='sm'>
                    Page {Math.ceil((total - end) / rowsPerPage)}
                    &nbsp;
                    of {Math.ceil(total / rowsPerPage)}
                </Text>

                <IconButton
                    onClick={() => getNextRecords(end - 1, rowsPerPage, true)}
                    className="fa-icon-css" aria-label='Search database' icon={<FontAwesomeIcon
                        icon={faAngleRight as IconProp} />} />
                <IconButton
                    onClick={() => getNextRecords(rowsPerPage, rowsPerPage, true)}
                    className="fa-icon-css" aria-label='Search database' icon={<FontAwesomeIcon
                        icon={faAngleDoubleRight as IconProp} />} />
            </Box>
        </>


    )
}
