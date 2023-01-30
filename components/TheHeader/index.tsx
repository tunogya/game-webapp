import {HStack, Spacer, Stack, Text, chakra} from "@chakra-ui/react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useRouter} from "next/router";

const TheHeader = () => {
  const router = useRouter();

  return (
    <HStack h={'64px'} w={'full'} bg={'blue.600'} alignItems={"center"} px={[2, 4, 6]} spacing={[2,4,6]} userSelect={'none'}>
      <HStack spacing={3} onClick={() => {
        router.push('/dashboard')
      }} cursor={'pointer'}>
        <chakra.img src={"/icon.svg"} width={['24px', '32px']} height={['24px', '32px']} alt={'wizardingpay'} />
        <Text color={'white'} fontSize={['sm', 'md', 'xl']} fontWeight={'500'}>WizardingPay</Text>
      </HStack>
      <Spacer/>
      <Stack>
        <ConnectButton/>
      </Stack>
    </HStack>
  )
}

export default TheHeader