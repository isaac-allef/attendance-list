import { Alert, AlertIcon, Box, Button, CloseButton, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Grid, Heading, Input, Link, Spinner } from "@chakra-ui/react";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";

import * as Yup from 'yup';

import React from 'react';
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Core from "../../components/Core";
import AttendanceListForm from "../../components/AttendanceListForm";
import { useRouter } from "next/router";

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

export default function Edit({ attendance_list }: Props) {  
  // const { isFallback } = useRouter();

  // if (isFallback) {
  //     return <Core><Spinner size="xl"/></Core>;
  // }

  const { id, title, note } = attendance_list;

  return (
      <Core>
        <Heading size="2xl" lineHeight="shorter">Your attendance list</Heading>
        <AttendanceListForm attendance_list={attendance_list} />
      </Core>
  )
}

// SE COMENTAR ESSA FUNÇÃO E DESCOMENTAR AS OUTRAS PARTES DO CÓDIGO QUE ESTÃO COMENTADAS,
// ESSA PÁGINA VAI VIRAR UMA SSG, AGORA ELA É UMA SSR
export const getServerSideProps:GetServerSideProps = async (context) => {
  const { id } = context.query;
  
  const response = await fetch(`http://localhost:3333/attendance_list/${id}`);
  const data = await response.json();
  
  if (data.message) {
    return {
      notFound: true,
    }
  }

  return { 
      props: {
          attendance_list: data as Attendance_list,
      }
  }
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   // const response = await fetch(`http://localhost:3333/attendance_list`);
//   // const data = await response.json();

//   // const paths = data.map(attedance => {
//   //     return { params: { id: attedance.id } }
//   // })

//   return {
//       paths: [],
//       fallback: true
//   }
// }

// export const getStaticProps:GetStaticProps = async (context) => {
//   const { id } = context.params;

//   const response = await fetch(`http://localhost:3333/attendance_list/${id}`);
//   const data = await response.json();

//   const notFound = data.message ? true : false;

//   return { 
//       props: {
//           attendance_list: data as Attendance_list,
//       },
//       revalidate: 1,
//       notFound
//   }
// }