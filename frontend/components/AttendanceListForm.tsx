import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Box, Button, CloseButton, FormControl, FormErrorMessage, Input, /*Link*/ } from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik, useFormik, useFormikContext, validateYupSchema } from "formik";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
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

  const [saving, setSaving] = useState(false)
  const [valuesForm, setValuesForm] = useState({})

    const { id, title, note, keys } = attendance_list;


    // const formSchema = Yup.object().shape({
    //     title: Yup.string()
    //       .required('Required'),
    //     note: Yup.string()
    //       .required('Required'),
    //     keys: Yup.array().of(
    //       Yup.object().shape({
    //         value: Yup.string()
    //         .required('Required'),
    //       })
    //     )
    //   });
    
    const initialValues = {
        title: title,
        note: note,
        keys: keys,
      }

    async function updateAttendanceList(values:object, id: string) {
      const response = await fetch(`http://localhost:3333/attendance_list/${id}`, {
          method: 'PUT',
          body: JSON.stringify(values, null, 2),
          headers: {
              "Content-type": "application/json"
          }
      });
      return await response.json();
    }

    function validateTitle(title) {
      let error
      if (title === '')
        error = 'Required'
      return error
    }

    let timeoutTitle = null
    const saveTitle = async (title: string, id: string) => {
      let error = validateTitle(title)
      if (error) return error

      setSaving(true)
      if (timeoutTitle) clearTimeout(timeoutTitle);
      timeoutTitle = setTimeout(() => updateAttendanceList({ title }, id), 1000);
      setSaving(false)
    }

    function validateNote(note) {
      let error
      if (note === '')
        error = 'Required'
      return error
    }

    let timeoutNote = null
    const saveNote = async (note: string, id: string) => {
      let error = validateNote(note)
      if (error) return error

      setSaving(true)
      if (timeoutNote) clearTimeout(timeoutNote);
      timeoutNote = setTimeout(() => updateAttendanceList({ note }, id), 1000);
      setSaving(false)
    }

    async function addKey(attendance_list_id: string, value: string) {
      const response = await fetch(`http://localhost:3333/key`, {
          method: 'POST',
          body: JSON.stringify({attendance_list_id, value}, null, 2),
          headers: {
              "Content-type": "application/json"
          }
      });
      return await response.json();
    }

    async function removeKey(id: number) {
      const response = await fetch(`http://localhost:3333/key/${id}`, {
          method: 'DELETE'
      });
      return await response.json();
    }

    async function changeKeyValue(id: number, value: string) {
      const response = await fetch(`http://localhost:3333/key/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ value }, null, 2),
          headers: {
              "Content-type": "application/json"
          }
      });
      return await response.json();
    }

    function validateKey(value, listKey, currentKeyIndex) {
      let error
      if (value === '')
        error = 'Required'
      if (listKey.find( (key, i) => currentKeyIndex!== i && key.value === value)) {
        error = ('This key already exists in this list')
      }

      return error
    }

    let timeoutKey = null
    const saveChangeKey = async (id: number, value: string, listKey, currentKeyIndex) => {
      let error = validateKey(value, listKey, currentKeyIndex)
      if (error) return error

      setSaving(true)
      if (timeoutKey) clearTimeout(timeoutKey);
      timeoutKey = setTimeout(async () => {
        await changeKeyValue(id, value)
        setSaving(false)
      }, 1000);
    }

    return (
        <Formik
          initialValues={initialValues}
          // validationSchema={formSchema} // ESSA VALIDAÇÃO SÓ FUNCIONA DE MANEIRA VISUAL,
                                        // PQ EU ESTOU FAZENDO AS ALTERAÇÕES NO ONCHANGE DO INPUT,
                                        // UMA ÍDEIA PARA SOLUCIONAR É VOLTAR A O USAR A VALIDAÇÃO FEITA POR FUNÇÃO (validate)
          validateOnChange={true}
          onSubmit={(values, actions) => console.log(values)} // NÃO ESTOU USANDO PQ ESTOU SALVANDO TODAS AS ALTERAÇÕES DIRETO NO ONCHANGE DO INPUT
        >
          {(props) => (
            <Form>
              {saving ? <p>Saving...</p> : <p>Saved</p>}

              <Field name="title" validate={validateTitle}>
                {({ field, form }) => (

                  <FormControl isInvalid={form.errors.title && form.touched.title}>
                    <Input {...field} mt={3} id="title" placeholder="Title" onChange={async (e) => {
                                                                                              props.handleChange(e)
                                                                                              props.handleBlur(e)
                                                                                              saveTitle(e.target.value, id)} } 
                                                                                            />
                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                  </FormControl>
                
                )}
              </Field>

              <Field name="note" validate={validateNote}>
                {({ field, form }) => (

                  <FormControl isInvalid={form.errors.note && form.touched.note}>
                    <Input {...field} mt={3} id="note" placeholder="Note" onChange={async (e) => {
                                                                                            props.handleChange(e)
                                                                                            props.handleBlur(e)
                                                                                            saveNote(e.target.value, id)
                                                                                          } } />
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
                      onClick={async () => push(await addKey(id, Date.now().toString())) }
                    >
                      Add New Key
                    </Button>

                    <Box  minH={59} maxH={250}  overflow="auto" p={2}>
                    {props.values.keys.length > 0 &&
                      props.values.keys.map((key, index) => (
                          
                        <Box w="100%" p={1} d="flex" key={index}>

                          <Field name={`keys.${index}.value`} validateOnChange={true} validate={(value) => validateKey(value, props.values.keys, index)}>
                            {({ field, form }) => (

                                <FormControl isInvalid={form.errors.keys && form.errors.keys[index] && form.errors.keys[index].value && form.touched.keys && form.touched.keys[index] && form.touched.keys[index].value}>
                                <Box d="flex" alignItems="center">
                                  <Input {...field} id={`keys.${index}.value`} placeholder="Key" onChange={async (e) => {
                                                                                                                    props.handleChange(e)
                                                                                                                    props.handleBlur(e)
                                                                                                                    saveChangeKey(key.id, e.target.value, props.values.keys, index)
                                                                                                                  } 
                                                                                                          } />
                                  <CloseButton
                                      type="button"
                                      onClick={async () => removeKey(key.id).then(remove(index))}
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
              
            </Form>
          )}
        </Formik>
    )
}

