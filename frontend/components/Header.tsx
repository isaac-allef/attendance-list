import { ExternalLinkIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, /*Link*/ } from "@chakra-ui/react";
import Link from 'next/link'

import Image from 'next/image'

export default function Header(props) {
    return (
        <Flex
            zIndex={1}
            bg="#202024"
            textColor="white"
            width="100%"
            height="10vh"
            padding={5}
            // border="1px"
            position="fixed"
            justifyContent="space-between"
            alignItems="center"
            paddingLeft={150}
            paddingRight={150}
        >
            <Link href="/"><a><Heading as="h3" size="md"> <MoonIcon /> Attendance List</Heading></a></Link>
            <Link href="https://www.google.com/"><a target="_blank">
                <Image
                    src="/github-icon.svg"
                    alt="Github icon"
                    width={25}
                    height={25}
                />
            </a></Link>
        </Flex>
    )
}