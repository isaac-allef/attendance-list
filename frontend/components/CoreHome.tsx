import { Flex, Grid } from "@chakra-ui/react";

export default function CoreHome(props) {
    return (
        <Grid
            as="main"
            height="100vh"
            border="1px"
            padding="15vh"
            templateColumns="1fr 480px 480px 1rf"
            templateRows="1fr 480px 480px 1rf"
            templateAreas="
                '. . . .'
                '. action1 action2 .'
                '. . . .'
            "
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            >
            <Flex
            className="upEffect"
            gridArea="action1" 
            flexDir="column" 
            alignItems="stretch"
            justifyContent="center"
            height="280px"
            width="380px"
            borderRadius="md"
            padding={16}
            border="1px"
            borderColor="gray.200"
            boxShadow="md"
            >
            {props.children[0]}
            </Flex>
            <Flex
            className="upEffect"
            gridArea="action2" 
            flexDir="column" 
            alignItems="stretch"
            justifyContent="center"
            height="280px"
            width="380px"
            borderRadius="md"
            padding={16}
            margin={5}
            border="1px"
            borderColor="gray.200"
            boxShadow="md"
            >
            {props.children[1]}
            </Flex>
        </Grid>
    )
}