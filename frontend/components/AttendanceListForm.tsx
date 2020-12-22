import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Box, Button, CloseButton, FormControl, FormErrorMessage, Input, /*Link*/ } from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import * as Yup from 'yup';

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

export default function AttendanceListForm({ attendance_list }: Props) {

    const { id, title, note, keys } = attendance_list;


    const formSchema = Yup.object().shape({
        title: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .required('Required'),
        note: Yup.string()
          .min(2, 'Too Short!')
          .max(150, 'Too Long!')
          .required('Required'),
        keys: Yup.array().of(
          Yup.object().shape({
            value: Yup.string()
            .min(2, 'Too Short!')
            .max(100, 'Too Long!')
            .required('Required'),
          })
        )
      });
    
    const initialValues = {
        title: title,
        note: note,
        keys: keys,
      }

      async function updateAttendanceList(values, id) {
        const response = await fetch(`http://localhost:3333/attendance_list/${id}`, {
            method: 'PUT',
            body: JSON.stringify(values, null, 2),
            headers: {
                "Content-type": "application/json"
            }
        });
        return await response.json();
      }
    
      const handleSubmit = async (values, actions) => {
          try {
            const data = await updateAttendanceList(values, id)
            actions.setSubmitting(false)
            actions.setStatus({success: true})
          } catch(err) {
            console.log(err)
            actions.setStatus({success: false})
          }
      }

    return (
        <Formik
          initialValues={initialValues}
          validationSchema={formSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form>

              <Field name="title">
                {({ field, form }) => (

                  <FormControl isInvalid={form.errors.title && form.touched.title}>
                    <Input {...field} mt={3} id="title" placeholder="Title" />
                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                  </FormControl>
                
                )}
              </Field>

              <Field name="note">
                {({ field, form }) => (

                  <FormControl isInvalid={form.errors.note && form.touched.note}>
                    <Input {...field} mt={3} id="note" placeholder="Note" />
                    <FormErrorMessage>{form.errors.note}</FormErrorMessage>
                  </FormControl>

                )}
              </Field>

              <FieldArray name="keys">
                {({ insert, remove, push }) => (

                  <Box mt={3} borderWidth="1px" borderRadius="lg" maxW="sm">

                    <Button
                      width="sm"
                      borderRadius="zero"
                      borderTopRadius="lg"
                      type="button"
                      onClick={() => push({ value: ''})}
                    >
                      Add New Key
                    </Button>

                    <Box  minH={59} maxH={250}  overflow="auto" p={2}>
                    {props.values.keys.length > 0 &&
                      props.values.keys.map((key, index) => (
                          
                        <Box w="100%" p={1} d="flex" key={index}>

                          <Field name={`keys.${index}.value`}>
                            {({ field, form }) => (

                                <FormControl isInvalid={form.errors.keys && form.errors.keys[index] && form.errors.keys[index].value && form.touched.keys && form.touched.keys[index] && form.touched.keys[index].value}>
                                
                                <Box d="flex" alignItems="center">
                                  <Input {...field} id={`keys.${index}.value`} placeholder="Key" />
                                  <CloseButton
                                      type="button"
                                      onClick={() => remove(index)}
                                  />
                                </Box>
                                
                                <FormErrorMessage>{form.errors.keys && form.errors.keys[index] && form.errors.keys[index].value ? form.errors.keys[index].value : null}</FormErrorMessage>
                                </FormControl>
                            )}
                          </Field>

                        </Box>

                      )).reverse()}
                    </Box>

                  </Box>

                )}
              </FieldArray>

              <Button
                mt={4}
                colorScheme="blue"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Save
              </Button>

              <Box
                color="blue.400"
                _hover={ { color: 'blue.300' } }
                alignItems="center"
                justifyContent="center"
                padding={2}
              >
                <Link href={`http://localhost:3000/attendance_lists/${id}`}>
                    <a target="_blank">Attendance List <ExternalLinkIcon /></a>
                </Link>
              </Box>

              {props.status && props.status.success && (
                <Alert status="success"
                        borderRadius="sm" 
                        marginTop={1}>
                    <AlertIcon />
                    Attendance list saved
                </Alert>
              )}
              
            </Form>
          )}
        </Formik>
    )
}

