import {Stack, Text, chakra, shouldForwardProp} from "@chakra-ui/react";
import {BigNumber} from "ethers";
import {FC, useMemo} from "react";
import {isValidMotionProp, motion} from "framer-motion";

type MiniPockerProps = {
  id: BigNumber,
  hidden?: boolean,
}

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

const MiniPocker: FC<MiniPockerProps> = (props) => {
  const {id, hidden} = props

  const suitStr = useMemo(() => {
    const suit = BigNumber.from(id).mod(4).toNumber()
    switch (suit) {
      case 0:
        return '♠'
      case 1:
        return '♥'
      case 2:
        return '♦'
      case 3:
        return '♣'
    }
  }, [id])

  const rankStr = useMemo(() => {
    const rank = BigNumber.from(id).mod(13).toNumber()
    switch (rank) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 0:
        return 'K'
      default:
        return rank
    }
  }, [id])

  if (BigNumber.from(id).eq(0)) return (<></>)

  return (
    <ChakraBox
      whileHover={{scale: 1.2, transition: {duration: 0.2}}}
      whileTap={{scale: 0.9}}
    >
      <Stack w={'29px'} h={'44px'} border={'1px solid white'} borderRadius={'4px'} bg={hidden ? 'blue.500' : 'white'}
             cursor={'pointer'} bgImage={'url(/icon.svg)'} zIndex={"base"}
             spacing={0} boxShadow={'sm'} p={'2px'} justify={hidden ? 'center' : "space-between"} userSelect={'none'}>
        {
          !hidden && (
            <>
              <Text fontSize={'xx-small'} lineHeight={'10px'} zIndex={"base"}
                    color={suitStr === '♦' || suitStr === '♥' ? 'red' : 'black'}>{rankStr}</Text>
              <Text fontSize={'sm'} textAlign={"center"} lineHeight={'20px'} zIndex={"base"}
                    color={suitStr === '♦' || suitStr === '♥' ? 'red' : 'black'}>{suitStr}</Text>
              <Text fontSize={'xx-small'} color={suitStr === '♦' || suitStr === '♥' ? 'red' : 'black'} zIndex={"base"}
                    lineHeight={'10px'} transform={'rotate(180deg)'}>{rankStr}</Text>
            </>
          )
        }
      </Stack>
    </ChakraBox>
  )
}

export default MiniPocker