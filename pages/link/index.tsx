import {Avatar, Button, HStack, Stack, Text, useToast} from "@chakra-ui/react";
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useAccount, useSignMessage} from 'wagmi'
import axios from "axios";
import {useRouter} from "next/router";
import useTelegramUser from "../../hooks/useTelegramUser";
import {useCallback, useEffect, useMemo, useState} from "react";

export default function Link() {
  const {address} = useAccount();
  const router = useRouter();
  const {userId} = router.query;
  const {user} = useTelegramUser(userId);
  const message = useMemo(() => {
    return `I want to link my wallet to this Telegram account: @${user.username}.`;
  }, [user.username])
  const {data, isError, isLoading, isSuccess, signMessage} = useSignMessage({
    message: message,
  });
  const toast = useToast()
  const [wallet, setWallet] = useState<string[]>([]);

  const getWallet = useCallback(async () => {
    if (!userId) {
      return
    }
    try {
      const res = await axios({
        method: 'get',
        url: `https://wggmo6xpdtuaa3ovkmcl5cm5lm0tsodx.lambda-url.ap-northeast-1.on.aws/?userId=${userId}`,
      })
      if (res.data) {
        setWallet(res.data.wallet)
      }
    } catch (e) {
      console.log(e)
    }
  }, [userId])

  const postMessage = useCallback(async () => {
    const res = await axios({
      method: 'post',
      url: `https://wggmo6xpdtuaa3ovkmcl5cm5lm0tsodx.lambda-url.ap-northeast-1.on.aws/?userId=${userId}`,
      data: {
        message: message,
        sign: data,
        address: address,
      }
    })
    if (res.data?.address?.toLowerCase() === address?.toLowerCase()) {
      await getWallet();
      toast({
        title: "Success",
        status: "success",
        variant: "subtle",
        description: "Your wallet is linked success!",
      })
    } else {
      toast({
        title: "Error",
        status: "error",
        variant: "subtle",
        description: "Some error occurred, please try again later.",
      })
    }
  }, [address, data, getWallet, message, toast, userId])

  useEffect(() => {
    getWallet();
  }, [getWallet])

  useEffect(() => {
    if (isSuccess) {
      postMessage();
    }
    if (isError) {
      toast({
        title: "Error",
        status: "error",
        variant: "subtle",
        description: "Some error occurred, please try again later.",
      })
    }
  }, [isError, isSuccess, postMessage, toast])

  return (
    <Stack maxW={'container.sm'} w={'full'} p={3}>
      <HStack justifyContent={"space-between"}>
        <Avatar border={'2px solid white'} boxShadow={"rgba(0,0,0,0.1) 0px 4px 12px 0px"}
                name={user.username || user.first_name || user.last_name || '-'}
                src={user.avatar_url}/>
        <ConnectButton/>
      </HStack>
      <Stack py={20}>
        <Button onClick={async () => signMessage?.()} isLoading={isLoading}>
          Link new wallet
        </Button>
      </Stack>
      <Stack>
        <Text fontWeight={'bold'}>My linked wallets</Text>
      </Stack>
      <Stack>
        {
          wallet.map((address, index) => (
            <Text key={index} fontSize={'sm'}>{address}</Text>
          ))
        }
      </Stack>
    </Stack>
  )
}