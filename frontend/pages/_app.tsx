import { ChakraProvider } from "@chakra-ui/react"

import { extendTheme } from "@chakra-ui/react"
import Header from "../components/Header"

import NProgress from 'nprogress'
import { Router } from "next/router"

Router.events.on("routeChangeStart", (url) => NProgress.start())
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

const fonts = {
  body: 'Rubik, Helvetica, Arial, sans-serif',
  heading: 'Rubik, Helvetica, Arial, sans-seri,f',
  mono: 'Menlo, monospace'
}
const fontWeights = {
  normal: 400,
  medium: 600,
  bold: 700,
}
const radii = {
  sm: '5px',
  md: '8px',
}

const colors = {
  purple: {
    500: '#8357e5',
  },
  gray: {
    300: '#e1e1e6',
    600: '#29292e',
    700: '#202024',
    800: '#121214',
  },
  blue: {
    400: '#0070f3'
  }
}

const theme = extendTheme({ colors, radii, fontWeights, fonts })

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp