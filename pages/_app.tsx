import '@rainbow-me/rainbowkit/styles.css';
import type {AppProps} from 'next/app'
import {Center, ChakraProvider} from "@chakra-ui/react";
import theme from "../theme";
import Script from "next/script";
import {configureChains, createClient, goerli, mainnet, WagmiConfig} from "wagmi";
import {connectorsForWallets, RainbowKitProvider} from "@rainbow-me/rainbowkit";
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

const {chains, provider} = configureChains(
  [mainnet, goerli],
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
      <RainbowKitProvider chains={chains}>
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
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
