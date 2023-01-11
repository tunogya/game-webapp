import {Button, HStack, Stack, Text} from "@chakra-ui/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSignMessage } from 'wagmi'

export default function Link () {
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: 'link my wallet',
  });

  return (
    <Stack maxW={'container.sm'} w={'full'} p={3}>
      <HStack justifyContent={"space-between"}>
        <Text></Text>
        <ConnectButton/>
      </HStack>
      <Stack py={20}>
        <Button onClick={() => signMessage?.()} isLoading={isLoading}>
          Link wallet
        </Button>
      </Stack>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </Stack>
  )
}