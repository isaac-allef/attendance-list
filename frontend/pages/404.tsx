import { Flex } from '@chakra-ui/react'
import Image from 'next/image'

export default function Custom404() {
    // return <h1>404 - Page Not Found</h1>
    return (
        <Flex justifyContent="center" padding={10}>
            <Image
                src="/404_not_found.svg"
                alt="404 - Page Not Found"
                width={500}
                height={500}
            />
        </Flex>
    )
}