import { Box, Button, Flex, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from 'next/router'
import CoreHome from "../components/CoreHome";
import * as Yup from 'yup';
import { AddIcon, EditIcon } from "@chakra-ui/icons";


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

      <Flex justifyContent="center" direction="column" alignItems="center">
        <AddIcon />
        <Button
          onClick={createAttendanceList}
        >{'< Create />'}</Button>
      </Flex>
      
      <Formik initialValues={initialValues}
              validationSchema={formSchema}
              onSubmit={handleSubmit} >

        {(props) => (

          <Form>

            <EditIcon />
            
            <Field name="code">
              {({ field, form }) => (

                <FormControl isInvalid={form.errors.code && form.touched.code}>
                  <Input {...field} mt={3} id="code" placeholder="Code" />
                  <FormErrorMessage>{form.errors.code}</FormErrorMessage>
                </FormControl>
              
              )}
            </Field>

            <Button
              type="submit"
            >{'< Edit />'}</Button>
          </Form>

        )}

      </Formik>

    </CoreHome>
  </>)
}