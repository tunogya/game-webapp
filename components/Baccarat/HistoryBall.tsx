import {
  Divider, HStack, Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import {FC} from "react";
import {BigNumber} from "ethers";
import MiniPocker from "./MiniPocker";

export type ResultType = {
  cursor: BigNumber,
  bankerPoints: BigNumber,
  playerPoints: BigNumber,
  bankerHands1: BigNumber,
  bankerHands2: BigNumber,
  bankerHands3: BigNumber,
  playerHands1: BigNumber,
  playerHands2: BigNumber,
  playerHands3: BigNumber,
}

type HistoryBallProps = {
  index: number,
  result: ResultType,
}

const HistoryBall: FC<HistoryBallProps> = (props) => {
  const {
    cursor,
    bankerPoints,
    playerPoints,
    bankerHands1,
    bankerHands2,
    bankerHands3,
    playerHands1,
    playerHands2,
    playerHands3
  } = props.result

  const bPair = (BigNumber.from(bankerHands1).mod(13)).eq(BigNumber.from(bankerHands2).mod(13))
  const pPair = (BigNumber.from(playerHands1).mod(13)).eq(BigNumber.from(playerHands2).mod(13))
  const super6 = (BigNumber.from(bankerPoints).mod(10)).eq(6)
  const banker = BigNumber.from(bankerPoints).gt(playerPoints)
  const player = BigNumber.from(playerPoints).gt(bankerPoints)
  const tie = BigNumber.from(bankerPoints).eq(playerPoints)

  return (
    <Popover trigger={'hover'} openDelay={0} closeDelay={0}>
      <PopoverTrigger>
        <Stack w={'40px'} h={'40px'} bg={player ? 'white' : (banker ? 'red.200' : '')}
               border={banker ? '' : '2px solid white'} cursor={'pointer'}
               borderRadius={'full'} alignItems={"center"} justify={"center"}>
          <Text color={player ? 'black' : 'white'} fontWeight={'bold'}
                textDecoration={(bPair || pPair) ? 'underline' : ''}>
            {banker && (super6 ? '6' : 'B')}
            {player && 'P'}
            {tie && 'T'}
          </Text>
        </Stack>
      </PopoverTrigger>
      <PopoverContent bg={'blue.600'} borderRadius={'0'} borderWidth={'2px'} borderColor={'white'}>
        <PopoverBody>
          <Stack>
            <Text fontSize={'xx-small'} color={'blue.200'} fontWeight={'semibold'}>No: {BigNumber.from(cursor).toString()}</Text>
            <HStack justifyContent={'space-between'}>
              <Text fontSize={'sm'} fontWeight={'bold'} color={'blue.200'}>Banker: {BigNumber.from(bankerPoints).toString()}</Text>
              <Text fontSize={'sm'} fontWeight={'bold'} color={'blue.200'}>Player: {BigNumber.from(playerPoints).toString()}</Text>
            </HStack>
            <HStack justify={'space-between'}>
              <HStack p={2}>
                <MiniPocker id={bankerHands1} hidden={false}/>
                <MiniPocker id={bankerHands2} hidden={false}/>
                <MiniPocker id={bankerHands3} hidden={false}/>
              </HStack>
              <Divider orientation={'vertical'} height={'40px'}/>
              <HStack p={2}>
                <MiniPocker id={playerHands1} hidden={false}/>
                <MiniPocker id={playerHands2} hidden={false}/>
                <MiniPocker id={playerHands3} hidden={false}/>
              </HStack>
            </HStack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default HistoryBall