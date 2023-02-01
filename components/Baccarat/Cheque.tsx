import {HStack, Stack, Text} from "@chakra-ui/react";
import {FC} from "react";

export enum BaccaratBetType {
  Player = 'Player',
  Banker = 'Banker',
  Tie = 'Tie',
  PlayerPair = 'PlayerPair',
  BankerPair = 'BankerPair',
  SuperSix = 'SuperSix',
}

type ChequeProps = {
  value: number,
  odds: number,
}

const Cheque: FC<ChequeProps> = (props) => {
  const { odds, value } = props
  return (
    <HStack h={'full'} w={'full'} justify={"center"} spacing={0}>
      <Stack w={'full'} h={'full'} border={'2px dashed white'} bg={"rgba(0,0,0,0.6)"} justify={"center"}
             userSelect={'none'} boxShadow={'md'} alignItems={"center"} cursor={'pointer'}>
        <Text fontWeight={'bold'} color={'white'} fontSize={'3xl'}>+{value.toLocaleString('en-US', {
          maximumFractionDigits: 3,
        })}</Text>
        <Text fontWeight={'semibold'} color={'white'} fontSize={'xs'}>Expected: {(value * odds).toLocaleString('en-US', {
          maximumFractionDigits: 3,
        })}</Text>
      </Stack>
    </HStack>
  )
}

export default Cheque