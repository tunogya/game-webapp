import type { AppProps } from 'next/app'
import {Center, ChakraProvider} from "@chakra-ui/react";
import theme from "../theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Center>
        <Component {...pageProps} />
      </Center>
    </ChakraProvider>
  )
}
