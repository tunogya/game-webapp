import {Stack, Text, Tooltip} from "@chakra-ui/react";
import {FC} from "react";
import {BigNumber} from "ethers";

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
  )
}

export default HistoryBall