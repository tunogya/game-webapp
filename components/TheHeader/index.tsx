import {HStack, Spacer, Stack, Text} from "@chakra-ui/react";
import Image from "next/image";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useRouter} from "next/router";

const TheHeader = () => {
  const router = useRouter();

  const menu = [
    { pathname: '/dashboard', label: 'Game' },
    { pathname: '/state', label: 'State' },
  ]

  return (
    <HStack h={'64px'} w={'full'} bg={'blue.600'} alignItems={"center"} px={6} spacing={6} userSelect={'none'}>
      <HStack spacing={3} onClick={() => {
        router.push('/dashboard')
      }} cursor={'pointer'}>
        <Image src={"/icon.svg"} width={32} height={32} alt={'wizardingpay'} />
        <Text color={'white'} fontSize={'xl'} fontWeight={'500'}>WizardingPay</Text>
      </HStack>
      {
        menu.map((item, index) => (
          <Text key={index} color={'white'} onClick={() => router.push(item.pathname)} cursor={'pointer'}
                borderBottom={router.pathname === item.pathname ? '2px solid white' : '2px solid transparent'}
                _hover={{ opacity: 0.8 }}>{item.label}</Text>
        ))
      }
      <Text color={'white'} _hover={{ opacity: 0.8 }} cursor={"pointer"}>Setting</Text>
      <Spacer/>
      <Stack>
        <ConnectButton/>
      </Stack>
    </HStack>
  )
}

export default TheHeader