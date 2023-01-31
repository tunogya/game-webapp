import '@rainbow-me/rainbowkit/styles.css';
import type {AppProps} from 'next/app'
import {Center, ChakraProvider} from "@chakra-ui/react";
import theme from "../theme";
import Script from "next/script";
import {configureChains, createClient, goerli, WagmiConfig} from "wagmi";
import {connectorsForWallets, RainbowKitProvider, lightTheme} from "@rainbow-me/rainbowkit";
import {infuraProvider} from 'wagmi/providers/infura';
import {
  argentWallet,
  braveWallet,
  coinbaseWallet, imTokenWallet,
  injectedWallet,
  ledgerWallet, metaMaskWallet, omniWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";
import {RecoilRoot} from "recoil";
import Head from "next/head";

const {chains, provider} = configureChains(
  [goerli],
  [
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY!,
      priority: 1,
    }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({chains}),
      metaMaskWallet({chains}),
      walletConnectWallet({chains}),
      coinbaseWallet({chains, appName: 'Arrakis Dune'}),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      rainbowWallet({chains}),
      trustWallet({chains}),
      ledgerWallet({chains}),
      imTokenWallet({chains}),
      omniWallet({chains}),
      argentWallet({chains}),
      braveWallet({chains}),
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default function App({Component, pageProps}: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={lightTheme({
        borderRadius: 'medium',
      })}>
        <RecoilRoot>
          <ChakraProvider theme={theme}>
            <Center>
              <Component {...pageProps} />
              <Head>
                <title>Wizarding Pay</title>
                <meta
                  name="description"
                  content="Wizarding Pay"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
                <meta content={'yes'} name={"apple-mobile-web-app-capable"} />
                <meta content={'yes'} name={"mobile-web-app-capable"} />
                <meta content={'black'} name={"apple-mobile-web-app-status-bar-style"} />
                <meta content={'Wizarding Pay'} name={"apple-mobile-web-app-title"} />
                <meta content={'telephone=no'} name={"format-detection"} />
                <meta content={'email=no'} name={"format-detection"} />
                <meta name="theme-color" content="#2B6CB0"/>
                <link rel="icon" href="/favicon.svg"/>
              </Head>

              <Script src={"https://telegram.org/js/games.js"}/>
              <Script id={"telegram-web-app"} src={"https://telegram.org/js/telegram-web-app.js"}/>
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
        </RecoilRoot>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
