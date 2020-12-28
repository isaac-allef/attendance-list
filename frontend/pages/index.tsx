import { Box, Button, Flex, FormControl, FormErrorMessage, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from 'next/router'
import CoreHome from "../components/CoreHome";
import * as Yup from 'yup';
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/react"


export default function Home() {
  
  async function createAttendanceList() {
    try {
    const response = await fetch(`http://localhost:3333/attendance_list`, {
        method: 'POST',
        body: JSON.stringify({
          title: "Attendance List",
          note: "blablabla",
          keys: []
        }),
        headers: {
            "Content-type": "application/json"
        }
    });
    const data = await response.json();
    // console.log(data.id)
    router.push(`http://localhost:3000/edit/${data.id}`)
    } catch(err) {
      console.log(err)
    }
  }

  function editAttendanceList(id:string) {
    router.push(`http://localhost:3000/edit/${id}`)
  }

  const router = useRouter()

  const initialValues = {
    code: ""
  }

  const formSchema = Yup.object().shape({
    code: Yup.string()
      .min(40, 'This code does not have a valid size!')
      .max(40, 'This code does not have a valid size!')
      .required('Required')
  });

  const handleSubmit = async (values, actions) => {
    editAttendanceList(values.code)
  }

  return (<>
    <CoreHome>

      <Flex justifyContent="center" direction="column" alignItems="stretch">
        {/* <AddIcon /> */}
        <Button
          bgColor="blue.500"
          textColor="white"
          _hover={{bg: "blue.300"}}
          size="lg"
          onClick={createAttendanceList}
          >{'< Create />'}</Button>
        <Text marginTop={3}
              color="gray.500" 
              align="center"
        >Create a new Attendance List that can accept responses only from Keys chosen by you.</Text>
      </Flex>
      
      <Formik initialValues={initialValues}
              validationSchema={formSchema}
              onSubmit={handleSubmit} >

        {(props) => (

          <Form>

            <Field name="code">
              {({ field, form }) => (

                <FormControl isInvalid={form.errors.code && form.touched.code}>
                  <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none"
                                    children={<EditIcon />} />
                  <Input {...field} borderColor="gray.400" id="code" placeholder="Code" />
                  </InputGroup>
                  <FormErrorMessage>{form.errors.code}</FormErrorMessage>
                </FormControl>
              
              )}
            </Field>

            <Button
              bgColor="blue.500"
              textColor="white"
              _hover={{bg: "blue.300"}}
              marginTop={3}
              size="lg"
              isFullWidth
              type="submit"
            >{'< Edit />'}</Button>
            
            <Text marginTop={3}
                  color="gray.500" 
                  align="center"
                  >Insert a Attendance List Code to edit it</Text>
          </Form>

        )}

      </Formik>

    </CoreHome>
  </>)
}