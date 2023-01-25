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

const HistoryBall: FC<HistoryBallProps> = ({...props}) => {
  if (props.player) {
    return (
      <Stack w={'40px'} h={'40px'} bg={'white'} borderRadius={'full'} alignItems={"center"} justify={"center"} spacing={0}>
        <Text color={'black'} fontWeight={'bold'} textDecoration={(props.bPair || props.pPair) ? 'underline' : ''}>P</Text>
      </Stack>
    )
  }

  if (props.banker) {
    return (
      <Stack w={'40px'} h={'40px'} bg={'red.200'} borderRadius={'full'} alignItems={"center"} justify={"center"}>
        <Text color={'white'} fontWeight={'bold'} textDecoration={(props.bPair || props.pPair) ? 'underline' : ''}>
          { props.super6 ? '6' : 'B' }
        </Text>
      </Stack>
      )
  }

  if (props.tie) {
    return (
      <Stack w={'40px'} h={'40px'} border={'2px solid white'} borderRadius={'full'} alignItems={"center"} justify={"center"}>
        <Text color={'white'} fontWeight={'bold'} textDecoration={(props.bPair || props.pPair) ? 'underline' : ''}>T</Text>
      </Stack>
    )
  }

  return (
    <></>
  )
}

export default HistoryBall