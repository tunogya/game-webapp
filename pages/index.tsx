import {Button, Heading, Link, Stack, Text} from "@chakra-ui/react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useNetwork, useSignMessage} from "wagmi";
import {useCallback, useEffect, useMemo, useState} from "react";
import axios from "axios";

export default function Index() {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [status, setStatus] = useState("wait_connect")

  const message = useMemo(() => {
    return `https://game.wizardingpay.com wants you to sign in with your Ethereum account: ${address}. Chain ID: ${chain}. Issued At: ${new Date().toISOString()}. Expiration Time: ${new Date(new Date().getTime() + 86400000).toISOString()}`
  }, [address, chain])

  const { data: signature, signMessage, status: signStatus } = useSignMessage({
    message: message,
    onSuccess: () => {
      setStatus("signature_success")
    },
    onError: () => {
      setStatus("signature_error")
    }
  })

  useEffect(() => {
    if (!address) {
      setStatus("wait_connect")
    }
    if (address && signStatus === "idle") {
      setStatus("wait_for_signature")
      return
    }
    if (address && signStatus === "success") {
      setStatus("signature_success")
      return
    }
    if (address && signStatus === "error") {
      setStatus("signature_error")
      setTimeout(() => {
        setStatus("wait_for_signature")
      }, 3000)
      return
    }
  }, [address, signStatus])

  const getToken = useCallback(async () => {
    if (signStatus === "success" && signature && message) {
      const res = await axios({
        method: "POST",
        url: "https://api.wizardingpay.com/auth/token",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          signature,
          message,
          address,
        }
      })
      if (res.data) {
        console.log(res.data)
        // TODO save JWT token to local storage
      }
    }
  }, [address, message, signStatus, signature])

  useEffect(() => {
    getToken()
  }, [getToken])

  return (
    <Stack p={3} spacing={6}>
      <Heading>WizardingPay Game</Heading>
      { status === 'wait_connect' && (
        <Stack>
          <ConnectButton />
        </Stack>
      ) }
      {
        status === 'wait_for_signature' && address && (
          <Stack>
            <Text fontSize={'sm'}>{address}</Text>
            <Button fontSize={'sm'} isLoading={signStatus === "loading"}
                    onClick={() => signMessage?.()}>Sign in with Ethereum</Button>
          </Stack>
        )
      }
      {
        status === 'signature_success' && (
          <Stack>
            <Text fontSize={'sm'}>Signature success!</Text>
          </Stack>
        )
      }
      {
        status === 'signature_error' && (
          <Stack>
            <Text fontSize={'sm'}>Signature error!</Text>
          </Stack>
        )
      }
    </Stack>
  )
}