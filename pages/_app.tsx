import type { AppProps } from 'next/app'
import {Center, ChakraProvider} from "@chakra-ui/react";
import theme from "../theme";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Center>
        <Component {...pageProps} />
        <Script src={"https://telegram.org/js/games.js"}/>
        <Script src={"https://www.googletagmanager.com/gtag/js?id=G-GY77H61X8Q"}></Script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-GY77H61X8Q');
              `}
        </Script>
      </Center>
    </ChakraProvider>
  )
}
