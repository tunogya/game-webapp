import {HStack, Link, Spacer, Text} from "@chakra-ui/react";
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
    <HStack h={'64px'} w={'full'} bg={'black'} alignItems={"center"} px={6} spacing={6} userSelect={'none'}>
      <HStack spacing={3} onClick={() => {
        router.push('/dashboard')
      }} cursor={'pointer'}>
        <Image src={"/icon.svg"} width={32} height={32} alt={'wizardingpay'} />
        <Text color={'white'} fontSize={'xl'} fontWeight={'500'}>WizardingPay</Text>
      </HStack>
      {
        menu.map((item, index) => (
          <Link key={index} href={item.pathname} color={'white'}
                borderBottom={router.pathname === item.pathname ? '2px solid white' : '2px solid transparent'}
                _hover={{ opacity: 0.8 }}>{item.label}</Link>
        ))
      }
      <Text color={'white'} _hover={{ opacity: 0.8 }} cursor={"pointer"}>Setting</Text>
      <Spacer/>
      <ConnectButton/>
    </HStack>
  )
}

export default TheHeader