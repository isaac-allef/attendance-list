import { Flex, Grid } from "@chakra-ui/react";

export default function Core(props) {
    return (
        <Grid
            as="main"
            height="100vh"
            paddingTop="10vh"
            templateColumns="1fr 960px 1rf"
            templateRows="1fr 480px 1rf"
            templateAreas="
                '. . .'
                '. form .'
                '. . .'
            "
            justifyContent="center"
            alignItems="center"
            >
            <Flex
            className="upEffect"
            gridArea="form" 
            flexDir="column" 
            alignItems="stretch"
            height="100%"
            // background="gray.700"
            borderRadius="md"
            padding={16}
            border="1px"
            borderColor="gray.200"
            boxShadow="md"
            >
            {props.children}
            </Flex>
        </Grid>
    )
}