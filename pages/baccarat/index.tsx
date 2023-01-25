import {
  Button,
  chakra,
  HStack,
  shouldForwardProp,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import TheHeader from "../../components/TheHeader";
import HistoryBall from "../../components/Baccarat/HistoryBall";
import {useEffect, useState} from "react";
import {isValidMotionProp, motion} from 'framer-motion'
import Cheque, {BaccaratAction} from "../../components/Baccarat/Cheque";
import PickTokenModal from "../../components/Baccarat/PickTokenModal";
import {useRecoilValue} from "recoil";
import {baccaratChequeAtom} from "../../state";
import {useAccount, useBalance, useNetwork} from "wagmi";
import {BigNumber} from "ethers";
import {AddressZero} from "@ethersproject/constants";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

const Baccarat = () => {
  const {chain} = useNetwork()
  const { address} = useAccount()
  const [pickedCheque, setPickedCheque] = useState(0);
  const [action, setAction] = useState<BaccaratAction | null>(null);
  const [value, setValue] = useState(0);
  const cheque = useRecoilValue(baccaratChequeAtom);
  const { data: balanceData } = useBalance({
    chainId: chain?.id,
    address: address,
    token: cheque?.address === AddressZero ? undefined : cheque?.address,
  });
  const [balance, setBalance] = useState('-')

  useEffect(() => {
    if (balanceData) {
      setBalance(BigNumber.from(balanceData.value).div(BigNumber.from(10).pow(balanceData?.decimals || 0)).toNumber().toLocaleString('em-US', {
        maximumFractionDigits: 2,
      }))
    }
  }, [balanceData])

  const cheques = [
    {
      value: 1, color: '#81E6D9', label: '1'
    },
    {
      value: 10, color: 'purple', label: '10'
    },
    {
      value: 100, color: 'orange', label: '100'
    },
    {
      value: 1000, color: '#22543D', label: '1K'
    },
    {
      value: 10000, color: '#E53E3E', label: '1W'
    },
  ]

  const deal = (a: BaccaratAction) => {
    if (action === null) {
      setAction(a);
      setValue(value+ cheques[pickedCheque].value);
      return
    }
    if (action === a) {
      setValue(value+ cheques[pickedCheque].value);
    }
  }

  return (
    <Stack h={'100vh'} w={'full'} spacing={0} overflow={'scroll'} bg={"blue.600"}>
      <TheHeader/>
      <Stack p={'20px'} spacing={'20px'} justify={"center"}>
        <HStack justify={"space-around"}>
          <Text w={'120px'} color={'white'} fontWeight={'bold'}>
            Baccarat
          </Text>
          <HStack>
            {
              [
                {
                  rank: 'A',
                  suit: '♠',
                },
                {
                  rank: 'J',
                  suit: '♦',
                },
                {
                  rank: 'Q',
                  suit: '♥',
                }
              ].map((item, index) => (
                <Stack key={index} w={'57px'} h={'88px'} border={'1px solid white'} borderRadius={'6px'} p={1}
                       bg={'white'} boxShadow={'md'} userSelect={"none"}>
                  <Text fontSize={'xs'} fontWeight={'bold'}
                        color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
                  <Text fontSize={'xl'} textAlign={"center"}
                        color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.suit}</Text>
                  <Text fontSize={'xs'} fontWeight={'bold'} transform={'rotate(180deg)'}
                        color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
                </Stack>
              ))
            }
            <Text color={'red.200'} fontWeight={'bold'}>B</Text>
            <Stack w={'1px'} h={'100px'} bg={'white'}></Stack>
            <Text color={'blue.200'} fontWeight={'bold'}>P</Text>
            {
              [
                {
                  rank: 'A',
                  suit: '♠',
                },
                {
                  rank: 'J',
                  suit: '♦',
                },
                {
                  rank: 'Q',
                  suit: '♥',
                }
              ].map((item, index) => (
                <Stack key={index} w={'57px'} h={'88px'} border={'1px solid white'} borderRadius={'6px'} p={1}
                       bg={'white'} boxShadow={'md'} userSelect={"none"}>
                  <Text fontSize={'xs'} fontWeight={'bold'}
                        color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
                  <Text fontSize={'xl'} textAlign={"center"}
                        color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.suit}</Text>
                  <Text fontSize={'xs'} fontWeight={'bold'} transform={'rotate(180deg)'}
                        color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
                </Stack>
              ))
            }
          </HStack>
          <Button variant={"solid"} w={'120px'} colorScheme={'blue'}>
            Settle
          </Button>
        </HStack>
        <HStack justify={"center"} alignItems={"start"} spacing={'40px'}>
          <Stack h={'full'}>
            <Stack h={'40%'} w={'400px'} border={'2px solid white'} overflow={'scroll'}>
              <Table variant='striped' colorScheme='blackAlpha'>
                <Tbody>
                  <Tr>
                    <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>1</Td>
                    <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>0x1234...7892</Td>
                    <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>Banker</Td>
                    <Td fontSize={'xs'} color={'white'} fontWeight={'500'} isNumeric>25</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Stack>
            <Stack h={'60%'} w={'400px'} border={'2px solid white'} p={2}>
              <Text color={'blue.200'} fontWeight={'bold'}>History</Text>
              <Wrap>
                <WrapItem>
                  <HistoryBall banker={true} player={false} tie={false} bPair={true} pPair={false} super6={true}/>
                </WrapItem>
                <WrapItem>
                  <HistoryBall banker={true} player={false} tie={false}  bPair={false} pPair={false} super6={false}/>
                </WrapItem>
              </Wrap>
            </Stack>
          </Stack>
          <Stack h={'full'} border={'2px solid white'} spacing={0}>
            <HStack borderBottom={'1px solid white'} h={'80px'} spacing={0}>
              <Stack w={'300px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                     cursor={'pointer'} userSelect={'none'} spacing={0} onClick={() => deal(BaccaratAction.Tie)}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>TIE</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:8</Text>
                <Cheque value={value} hidden={action !== BaccaratAction.Tie} width={'300px'} height={'80px'} odds={9}/>
              </Stack>
              <Stack w={'200px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                     cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratAction.SuperSix)}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>Super 6</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:12</Text>
                <Cheque value={value} hidden={action !== BaccaratAction.SuperSix} width={'200px'} height={'80px'} odds={13}/>
              </Stack>
            </HStack>
            <HStack borderBottom={'1px solid white'} h={'160px'} spacing={0}>
              <Stack w={'300px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                     cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratAction.Banker)}
                     spacing={0}>
                <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'}>BANKER</Text>
                <Text color={'red.200'} fontSize={'sm'}>1:0.95</Text>
                <Cheque value={value} hidden={action !== BaccaratAction.Banker} width={'300px'} height={'160px'} odds={1.95}/>
              </Stack>
              <Stack w={'200px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                     cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratAction.BankerPair)}>
                <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>BANKER PAIR</Text>
                <Text color={'red.200'} fontSize={'sm'}>1:11</Text>
                <Cheque value={value} hidden={action !== BaccaratAction.BankerPair} width={'200px'} height={'160px'} odds={12}/>
              </Stack>
            </HStack>
            <HStack h={'160px'} borderBottom={'1px solid white'} spacing={0}>
              <Stack w={'300px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                     cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratAction.Player)}
                     spacing={0}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>PLAYER</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:1</Text>
                <Cheque value={value} hidden={action !== BaccaratAction.Player} width={'300px'} height={'160px'} odds={2}/>
              </Stack>
              <Stack w={'200px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                     cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratAction.PlayerPair)}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>PLAYER PAIR</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:11</Text>
                <Cheque value={value} hidden={action !== BaccaratAction.PlayerPair} width={'200px'} height={'160px'} odds={12}/>
              </Stack>
            </HStack>
            <Stack px={2} h={'320px'} alignItems={"center"} p={2}>
              <HStack justifyContent={"space-between"} w={'full'} spacing={0}>
                <Text fontWeight={'bold'} color={'blue.200'}>My Cheques</Text>
                <PickTokenModal/>
              </HStack>
              <Stack alignItems={"center"} justify={"center"} h={'full'}>
                <HStack spacing={'20px'}>
                  {
                    cheques.map((item, index) => (
                      <ChakraBox
                        key={index}
                        animate={pickedCheque === index ? {
                          scale: [1, 1.5, 1],
                          scaleY: [1, -1, 1],
                          rotateX: [0, 180, 360],
                        } : {}}
                        // @ts-ignore
                        transition={ pickedCheque === index ? {
                          duration: 2.4,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "loop",
                        } : {}}
                        bg={'white'}
                        w={'44px'}
                        h={'44px'}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        border={`4px dashed ${item.color}`}
                        borderRadius={'full'}
                        userSelect={'none'}
                        cursor={"pointer"}
                        boxShadow={'md'}
                        onClick={() => {
                          setPickedCheque(index)
                        }}
                      >
                        <Text fontWeight={'bold'} color={item.color}>{item.label}</Text>
                      </ChakraBox>
                    ))
                  }
                </HStack>
                <Text fontSize={'2xl'} color={'blue.200'} fontWeight={'bold'}>
                  {balance} { value > 0 && `- ${value.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}`} {cheque.symbol}
                </Text>
              </Stack>
              <HStack>
                <Button variant={"solid"} colorScheme={'blue'}>
                  Approve
                </Button>
                <Button variant={"solid"} colorScheme={'blue'}>
                  Action
                </Button>
                { value > 0 && (
                  <Button variant={"solid"} colorScheme={'red'}
                          onClick={() => {
                            setAction(null)
                            setValue(0)
                          }}>
                    Clear Action
                  </Button>
                ) }
              </HStack>
            </Stack>
          </Stack>
          <Stack h={'full'} w={'400px'} border={'2px solid white'} p={2}>
            <HStack justifyContent={'space-between'}>
              <Text color={'blue.200'} fontWeight={'bold'}>Shoe</Text>
              <Button variant={"solid"} colorScheme={'blue'}>Shuffle</Button>
            </HStack>
            <Wrap justify={'center'}>
              {
                [
                  {
                    rank: 'A',
                    suit: '♠',
                  },
                  {
                    rank: 'J',
                    suit: '♦',
                  },
                  {
                    rank: 'Q',
                    suit: '♥',
                  },
                  {
                    rank: '7',
                    suit: '♣',
                  },
                  {
                    rank: '9',
                    suit: '♣',
                  },
                  {
                    rank: '10',
                    suit: '♦',
                  },
                  {
                    rank: 'A',
                    suit: '♠',
                  },
                  {
                    rank: 'J',
                    suit: '♦',
                  },
                  {
                    rank: 'Q',
                    suit: '♥',
                  },
                  {
                    rank: '7',
                    suit: '♣',
                  },
                  {
                    rank: '9',
                    suit: '♣',
                  },
                  {
                    rank: '10',
                    suit: '♦',
                  },
                  {
                    rank: 'A',
                    suit: '♠',
                  },
                  {
                    rank: 'J',
                    suit: '♦',
                  },
                  {
                    rank: 'Q',
                    suit: '♥',
                  },
                  {
                    rank: '7',
                    suit: '♣',
                  },
                  {
                    rank: '9',
                    suit: '♣',
                  },
                  {
                    rank: '10',
                    suit: '♦',
                  },
                ].map((item, index) => (
                  <WrapItem key={index}>
                    <Stack w={'29px'} h={'44px'} border={'1px solid white'} borderRadius={'4px'} bg={'white'}
                           spacing={0}
                           boxShadow={'sm'} p={'2px'} justify={"space-between"} userSelect={'none'}>
                      <Text fontSize={'xx-small'} lineHeight={'10px'}
                            color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
                      <Text fontSize={'sm'} textAlign={"center"} lineHeight={'20px'}
                            color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.suit}</Text>
                      <Text fontSize={'xx-small'} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}
                            lineHeight={'10px'} transform={'rotate(180deg)'}>{item.rank}</Text>
                    </Stack>
                  </WrapItem>
                ))
              }
            </Wrap>
          </Stack>
        </HStack>
      </Stack>
    </Stack>
  )
}

export default Baccarat