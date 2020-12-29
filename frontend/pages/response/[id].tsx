import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { Button, Flex, Grid, Heading, Input, Text, InputGroup, InputLeftElement, InputRightElement, TagLabel, /*Link,*/ Divider, Alert, AlertIcon, CloseButton, Box, Badge } from "@chakra-ui/react"
import { CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
import { Spinner } from "@chakra-ui/react"
import Core from '../../components/Core';

import Link from 'next/link'
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';

import React from 'react'

interface Key {
    id: number,
    value: string,
    present: boolean
}

interface Attendance_list {
    id: string,
    title: string,
    note: string,
    closed: boolean,
    keys: Key[]
}

interface Props {
    attendance_list: Attendance_list
}

import useSWR from "swr";

const fetcher = url => fetch(url).then(res => {
    if (res.status === 500) {
        throw new Error('API Client Error');
    }
    return res.json()
});

export default function AttendanceList() {
    const { query } = useRouter()
    
    const { data, error } = useSWR(`http://localhost:3333/attendance_list/${query.id}`, fetcher)
    if (error) return <Core>Failed to load</Core>
    if (!data) return <Core><Spinner size="xl"/></Core>
    const attendance_list = data

    const { id, title, note } = attendance_list;

    return (
        <Core>    
            <Heading size="2xl" lineHeight="shorter">{ title }</Heading>
            <Text
                marginTop={5}
                marginBottom={2}
            >{ note }</Text>
            <Box maxH={220} overflow="auto" 
                display="flex" 
                justifyContent="center"
                >
                <Table width={410}>
                    <Thead>
                        <Tr>
                            <Th paddingLeft={1} textAlign="start" border="1px" borderColor="gray.400">Key</Th>
                            <Th paddingLeft={1} textAlign="end" paddingRight={3} border="1px" borderColor="gray.400">Present</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            // React.Children.toArray(
                                attendance_list?.keys?.map( key => (
                                    <Tr key={key.value}>
                                        <Td paddingLeft={1} textAlign="start" paddingRight={10} border="1px" borderColor="gray.400">{key.value}</Td>
                                        {
                                            key.present ? 
                                                <Td paddingLeft={1} textAlign="end" border="1px" borderColor="gray.400">
                                                    <Badge variant="outline" colorScheme="green" width="70px" padding={1} margin={2}>
                                                        Present
                                                    </Badge>
                                                </Td>
                                            :
                                                <Td paddingLeft={1} textAlign="end" border="1px" borderColor="gray.400">
                                                    <Badge variant="outline" colorScheme="red" width="70px" padding={1} margin={2}>
                                                        Absent
                                                    </Badge>
                                                </Td>
                                        }
                                    </Tr>
                                ))
                            // )
                        }
                    </Tbody>
                </Table>
            </Box>
            
            <Divider padding={5} width="90%"/>
            <Box
                color="blue.400"
                _hover={ { color: 'blue.300' } }
                alignItems="center"
                justifyContent="center"
                padding={2}
            >
                <Link href="https://github.com/isaac-allef/attendance-list">
                    <a target="_blank">Gitub <ExternalLinkIcon /></a>
                </Link>
            </Box>
        </Core>
    )
}