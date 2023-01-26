import {Stack, Text} from "@chakra-ui/react";
import {FC} from "react";

type HistoryBallProps = {
  player: boolean;
  banker: boolean;
  tie: boolean;
  bPair: boolean;
  pPair: boolean;
  super6: boolean;
}

const HistoryBall: FC<HistoryBallProps> = (props) => {
  const { player, banker, tie, bPair, pPair, super6 } = props
  if (player) {
    return (
      <Stack w={'40px'} h={'40px'} bg={'white'} borderRadius={'full'} alignItems={"center"} justify={"center"} spacing={0}>
        <Text color={'black'} fontWeight={'bold'} textDecoration={(bPair || pPair) ? 'underline' : ''}>P</Text>
      </Stack>
    )
  }

  if (banker) {
    return (
      <Stack w={'40px'} h={'40px'} bg={'red.200'} borderRadius={'full'} alignItems={"center"} justify={"center"}>
        <Text color={'white'} fontWeight={'bold'} textDecoration={(bPair || pPair) ? 'underline' : ''}>
          { super6 ? '6' : 'B' }
        </Text>
      </Stack>
      )
  }

  if (tie) {
    return (
      <Stack w={'40px'} h={'40px'} border={'2px solid white'} borderRadius={'full'} alignItems={"center"} justify={"center"}>
        <Text color={'white'} fontWeight={'bold'} textDecoration={(bPair || pPair) ? 'underline' : ''}>T</Text>
      </Stack>
    )
  }

  return (
    <></>
  )
}

export default HistoryBall