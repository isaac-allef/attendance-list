import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, /*Link*/ } from "@chakra-ui/react";
import Link from 'next/link'

export default function Header(props) {
    return (
        <Flex
            bg="#202024"
            textColor="white"
            width="100%"
            height="10vh"
            padding={5}
            // border="1px"
            position="fixed"
            justifyContent="space-between"
            alignItems="center"
        >
            <Link href="/"><a><Heading as="h3" size="lg">Home</Heading></a></Link>
            <Link href="https://www.google.com/"><a target="_blank">GitHub <ExternalLinkIcon /></a></Link>
        </Flex>
    )
}