import {Avatar, Button, HStack, Stack, Text, useToast} from "@chakra-ui/react";
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useAccount} from 'wagmi'
import axios from "axios";
import {useRouter} from "next/router";
import useTelegramUser from "../../hooks/useTelegramUser";
import {useCallback, useEffect, useState} from "react";

export default function Link() {
  const {address} = useAccount();
  const router = useRouter();
  const {userId} = router.query;
  const {user} = useTelegramUser(userId);
  const toast = useToast()
  const [wallet, setWallet] = useState<string[]>([]);

  const getWallet = useCallback(async () => {
    if (!userId) {
      return
    }
    try {
      const res = await axios({
        method: 'get',
        url: `https://api.wizardingpay.com/tg/wallet?userId=${userId}`,
      })
      if (res.data) {
        setWallet(res.data.wallet)
      }
    } catch (e) {
      console.log(e)
    }
  }, [userId])

  const linkWallet = useCallback(async () => {
    try {
      const res = await axios({
        method: 'post',
        url: `https://api.wizardingpay.com/tg/wallet?userId=${userId}`,
        data: {
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
    } catch (e) {
      toast({
        title: "Error",
        status: "error",
        variant: "subtle",
        description: "Some error occurred, please try again later.",
      })
    }
  }, [userId, user.username, address, getWallet, toast])

  useEffect(() => {
    getWallet();
  }, [getWallet])

  return (
    <Stack maxW={'container.sm'} w={'full'} p={3}>
      <HStack justifyContent={"space-between"}>
        <Avatar border={'2px solid white'} boxShadow={"rgba(0,0,0,0.1) 0px 4px 12px 0px"}
                name={user.username || user.first_name || user.last_name || '-'}
                src={user.avatar_url}/>
        <ConnectButton/>
      </HStack>
      { address && (
        <Stack py={20}>
          <Button onClick={linkWallet}>
            Link new wallet
          </Button>
        </Stack>
      ) }
      <Stack>
        <Text fontWeight={'bold'}>My linked wallets</Text>
      </Stack>
      <Stack>
        {
          wallet.map((address, index) => (
            <li key={index}>{address.slice(0, 6)}...{address.slice(-4)}</li>
          ))
        }
      </Stack>
    </Stack>
  )
}