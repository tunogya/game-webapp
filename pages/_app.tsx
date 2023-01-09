import type { AppProps } from 'next/app'
import {Center, ChakraProvider} from "@chakra-ui/react";
import theme from "../theme";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Center>
        <Component {...pageProps} />
        <Script src="https://telegram.org/js/games.js"/>
      </Center>
    </ChakraProvider>
  )
}
