import {Stack, Text} from "@chakra-ui/react";
import {BigNumber} from "ethers";
import {FC, useMemo} from "react";

type MiniPockerProps = {
  suit: BigNumber,
  rank: BigNumber,
}

const MiniPocker: FC<MiniPockerProps> = (props) => {
  const {suit, rank} = props

  const suitStr = useMemo(() => {
    switch (BigNumber.from(suit).toNumber()) {
      case 1:
        return '♠'
      case 2:
        return '♥'
      case 3:
        return '♦'
      case 4:
        return '♣'
    }
  }, [suit])

  const rankStr = useMemo(() => {
      switch (BigNumber.from(rank).toNumber()) {
        case 1:
          return 'A'
        case 11:
          return 'J'
        case 12:
          return 'Q'
        case 13:
          return 'K'
        default:
          return rank.toString()
      }
  }, [rank])

  return (
    <Stack w={'29px'} h={'44px'} border={'1px solid white'} borderRadius={'4px'} bg={'white'}
           spacing={0}
           boxShadow={'sm'} p={'2px'} justify={"space-between"} userSelect={'none'}>
      <Text fontSize={'xx-small'} lineHeight={'10px'}
            color={suitStr === '♦' || suitStr === '♥' ? 'red' : 'black'}>{rankStr}</Text>
      <Text fontSize={'sm'} textAlign={"center"} lineHeight={'20px'}
            color={suitStr === '♦' || suitStr === '♥' ? 'red' : 'black'}>{suitStr}</Text>
      <Text fontSize={'xx-small'} color={suitStr === '♦' || suitStr === '♥' ? 'red' : 'black'}
            lineHeight={'10px'} transform={'rotate(180deg)'}>{rankStr}</Text>
    </Stack>
  )
}

export default MiniPocker