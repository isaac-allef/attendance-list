import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { Button, Flex, Grid, Heading, Input, Text, InputGroup, InputLeftElement, InputRightElement, TagLabel, /*Link,*/ Divider, Alert, AlertIcon, CloseButton, Box } from "@chakra-ui/react"
import { CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { Spinner } from "@chakra-ui/react"
import Core from '../../components/Core';

import Link from 'next/link'

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

export default function AttendanceList({ attendance_list }: Props) {
    const { isFallback } = useRouter();
    const [keyValue, setKeyValue] = useState("");
    const [keyIsInvalid, setKeyIsInvalid] = useState(false)
    const statusInicialValue = <div></div>;
    const [status, setStatus] = useState(statusInicialValue)
    
    if (isFallback) {
        return <Core><Spinner size="xl"/></Core>;
    }
    
    const { id, title, note } = attendance_list;

    function checkIfKeyIsInvalid(value) {
        const { keys } = attendance_list;
        
        if (keys.find(key => key.value === value)) {
            return false
        } else {
            return true
        }
    }

    const handleChange = (event) => {
        setStatus(statusInicialValue)
        const eValue = event.target.value;
        setKeyValue(eValue)
        if (eValue === "") {
            setKeyIsInvalid(false)
        } else {
            setKeyIsInvalid(checkIfKeyIsInvalid(eValue))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkIfKeyIsInvalid(keyValue)) {
            try {
                const result = await present(keyValue, id)
                setStatus(alertStatus('success', 'Present'))
            }catch(err) {
                setStatus(alertStatus('error', 'Fail'))
            }
        } else {
            setStatus(alertStatus('error', 'Invalid key'))
        }
    }

    const alertStatus = (type, text) => {
        // error || success || warning || info
        return (
            <Alert status={type} 
                    borderRadius="sm" 
                    marginTop={1}>
                <AlertIcon />
                {text}
                {/* <CloseButton position="absolute" 
                            right="8px" 
                            top="8px" 
                            onClick={
                                () => setStatus(statusInicialValue)
                            } /> */}
            </Alert>
        )
    }

    return (
        <Core>    
            <Heading size="2xl" lineHeight="shorter">{ title }</Heading>
            <Text
                marginTop={5}
                marginBottom={2}
            >{ note }</Text>
            <form onSubmit={handleSubmit}>
            <Input 
                id="key"
                height="50px"
                // background="gray.800"
                focusBorderColor="blue.400"
                borderRadius="sm"

                value={keyValue}

                isInvalid={keyIsInvalid}
                onChange={handleChange}
                errorBorderColor="red.300"
                placeholder="Key"
                autoFocus={true} />
            {status}
            <Button
                marginTop={6}
                // backgroundColor="yellow.700"
                height="50px"
                borderRadius="sm"
                colorScheme="blue"
                type="submit"
            >
                Present
            </Button>
            </form>
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

const present = async (value, attendance_list_id) => {
    const response = await fetch(`http://localhost:3333/key/present`, {
        method: 'PATCH',
        body: JSON.stringify({
            attendance_list_id: attendance_list_id,
            value: value,
            present: true
        }),
        headers: {
            "Content-type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}

export const getStaticPaths: GetStaticPaths = async () => {
    // const response = await fetch(`http://localhost:3333/attendance_list`);
    // const data = await response.json();

    // const paths = data.map(attedance => {
    //     return { params: { id: attedance.id } }
    // })

    return {
        paths: [],
        fallback: true
    }
}

export const getStaticProps:GetStaticProps = async (context) => {
    const { id } = context.params;

    const response = await fetch(`http://localhost:3333/attendance_list/${id}`);
    const data: Attendance_list = await response.json();

    return { 
        props: {
            attendance_list: data,
        },
        revalidate: 5
    }
}