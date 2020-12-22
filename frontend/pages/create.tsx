import { Alert, AlertIcon, Box, Button, CloseButton, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Grid, Heading, Input, Link } from "@chakra-ui/react";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { GetStaticProps } from "next";
import { useState } from "react";

import * as Yup from 'yup';

import React from 'react';
import { ExternalLinkIcon } from "@chakra-ui/icons";

// NÃO VOU USAR MAIS ESSA PÁGINA, PQ VOU USAR UM ESQUEMA IGUAL AOS DO FORMULÁRIO DO GOOGLE
// QUE CRIA UM FORMULÁRIO PADRÃO E DÁ ACESSO PARA A PESSOA EDITAR

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

export default function Create() {
  const [linkAttendanceList, setLinkAttendanceList] = useState("");
  const [linkAttendanceListValue, setLinkAttendanceListValue] = useState(<></>)
  const [readOnly, setReadOnly] = useState(false);

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

  // APRENDER FORMIK (https://formik.org/docs/tutorial)

  // LINK DO CÓDIGO DE CAMPOS DINAMICOS: https://codesandbox.io/s/github/formik/formik/tree/master/examples/field-arrays?from-embed=&file=/index.js:2101-2157

  return (
    <Grid
      as="main"
      height="100vh"
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
        <Heading size="2xl" lineHeight="shorter">Create your attendance list</Heading>
        <Formik
          initialValues={
            {
              title: "",
              note: "",
              keys: [
                {
                  value: '',
                },
              ],
            }
          }
          validationSchema={formSchema}
          onSubmit={async (values, actions) => {
            if (!readOnly) {
              try {
                const response = await fetch(`http://localhost:3333/attendance_list`, {
                    method: 'POST',
                    body: JSON.stringify(values, null, 2),
                    headers: {
                        "Content-type": "application/json"
                    }
                });
                const data = await response.json();
                setLinkAttendanceList(`http://localhost:3000/attendance_lists/${data.id}`)
                setLinkAttendanceListValue(<>Attendance List <ExternalLinkIcon /></>)
                actions.setSubmitting(false)
                actions.setStatus({success: true})
                setReadOnly(true)
              } catch(err) {
                console.log(err)
                actions.setStatus({success: false})
              }
            }
          }}
        >
          {(props) => (
            <Form>
              <Field name="title" /*validate={validateTitle}*/>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.title && form.touched.title}>
                    <Input {...field} readOnly={readOnly} mt={3} id="title" placeholder="Title" />
                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="note" /*validate={validateNote}*/>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.note && form.touched.note}>
                    <Input {...field} readOnly={readOnly} mt={3} id="note" placeholder="Note" />
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
                      onClick={() => !readOnly ? push({ value: ''}) : null}
                    >
                      Add New Key
                    </Button>
                    {/* <Divider mt={1} /> */}
                    <Box  minH={59} maxH={250}  overflow="auto" p={2}>
                    {props.values.keys.length > 0 &&
                      props.values.keys.map((key, index) => (
                        <Box w="100%" p={1} d="flex" key={index}>
                          <Field name={`keys.${index}.value`} /*validate={validateKey}*/>
                            {({ field, form }) => (
                                <FormControl isInvalid={form.errors.keys && form.errors.keys[index] && form.errors.keys[index].value && form.touched.keys && form.touched.keys[index] && form.touched.keys[index].value}>
                                <Box d="flex" alignItems="center">
                                  <Input {...field} readOnly={readOnly} id={`keys.${index}.value`} placeholder="Key" />
                                  <CloseButton 
                                      type="button"
                                      onClick={() => !readOnly ? remove(index) : null}
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
                Create
              </Button>
              {props.status && props.status.success && (
                <Alert status="success"
                        borderRadius="sm" 
                        marginTop={1}>
                    <AlertIcon />
                    Attendance list created: <Link
                                                href={linkAttendanceList}
                                                color="blue.400"
                                                _hover={ { color: 'blue.300' } }
                                                alignItems="center"
                                                justifyContent="center"
                                                padding={2}
                                              >
                                                  {linkAttendanceListValue}
                                              </Link>
                </Alert>
              )}
            </Form>
          )}
        </Formik>
      </Flex>
    </Grid>
  )
}