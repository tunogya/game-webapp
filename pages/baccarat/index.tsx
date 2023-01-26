import {
  Button,
  chakra,
  HStack, IconButton,
  shouldForwardProp, Spacer,
  Stack,
  Table,
  Tbody,
  Text,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import TheHeader from "../../components/TheHeader";
import HistoryBall from "../../components/Baccarat/HistoryBall";
import {useCallback, useEffect, useMemo, useState} from "react";
import {isValidMotionProp, motion} from 'framer-motion'
import Cheque, {BaccaratBetType} from "../../components/Baccarat/Cheque";
import PickTokenModal from "../../components/Baccarat/PickTokenModal";
import {useRecoilValue} from "recoil";
import {baccaratChequeAtom} from "../../state";
import {
  Address,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite
} from "wagmi";
import {AddressZero} from "@ethersproject/constants";
import ApproveERC20Button from "../../components/ApproveERC20Button";
import {BACCARAT_ADDRESS} from "../../constant/address";
import {BigNumber} from "ethers";
import {BACCARAT_ABI} from "../../constant/abi";
import LayoutItem from "../../components/Baccarat/LayoutItem";
import MiniPocker from "../../components/Baccarat/MiniPocker";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

const Baccarat = () => {
  const {chain} = useNetwork()
  const {address} = useAccount()
  const [pickedCheque, setPickedCheque] = useState(0);
  const [betType, setBetType] = useState<BaccaratBetType | null>(null);
  const [value, setValue] = useState(0);
  const cheque = useRecoilValue(baccaratChequeAtom);
  const {data: balanceData} = useBalance({
    chainId: chain?.id,
    address: address,
    token: cheque?.address === AddressZero ? undefined : cheque?.address,
    cacheTime: 0,
  });
  const [balance, setBalance] = useState('-');
  const spendAmount = useMemo(() => {
    return BigNumber.from(value).mul(BigNumber.from(10).pow(BigNumber.from(cheque?.decimals || 0))).toString()
  }, [cheque, value])
  const baccaratContract = {
    address: BACCARAT_ADDRESS[chain?.id || 5],
    abi: BACCARAT_ABI
  }
  const {data: cursorData} = useContractRead({
    ...baccaratContract,
    functionName: 'cursor',
    watch: true,
    cacheOnBlock: true,
  })
  const {data: chequesData} = useContractRead({
    ...baccaratContract,
    functionName: 'chequesOf',
    args: [address, cheque.address],
    watch: true,
    cacheOnBlock: true,
  })
  const {data: layoutData} = useContractRead({
    ...baccaratContract,
    functionName: 'layout',
    watch: true,
    cacheOnBlock: true,
  })
  const {data: cardsData} = useContractRead({
    ...baccaratContract,
    functionName: 'cardsOf',
    args: [0, 416],
    watch: true,
    cacheOnBlock: true,
  })
  const [showCard, setShowCard] = useState(true)
  const [cards, setCards] = useState([])

  const refreshCards = useCallback(async () => {
    if (cardsData && cursorData) {
      // @ts-ignore
      setCards(cardsData.filter((item, index) => {
        return index >= BigNumber.from(cursorData).toNumber()
      }))
    }
  }, [cardsData, cursorData])

  useEffect(() => {
    refreshCards()
  }, [refreshCards])

  const _betType = useMemo(() => {
    switch (betType) {
      case BaccaratBetType.Banker:
        return 0;
      case BaccaratBetType.Player:
        return 1;
      case BaccaratBetType.Tie:
        return 2;
      case BaccaratBetType.BankerPair:
        return 3;
      case BaccaratBetType.PlayerPair:
        return 4;
      case BaccaratBetType.SuperSix:
        return 5;
      default:
        return 0;
    }
  }, [betType])
  const {config: actionConfig} = usePrepareContractWrite({
    ...baccaratContract,
    functionName: 'action',
    args: [cheque.address, spendAmount, _betType],
    overrides: {
      value: cheque.address === AddressZero ? BigNumber.from(spendAmount) : 0,
      gasLimit: BigNumber.from(1000000),
    }
  })
  const {write: actionWrite, status: actionStatus} = useContractWrite(actionConfig)
  const randomNumber = useMemo(() => {
    return Math.floor(Math.random() * 1000000)
  }, [])
  const {config: shuffleConfig} = usePrepareContractWrite({
    ...baccaratContract,
    functionName: 'shuffle',
    args: [randomNumber]
  })
  const {write: shuffleWrite, status: shuffleStatus} = useContractWrite(shuffleConfig)
  const {config: settleConfig} = usePrepareContractWrite({
    ...baccaratContract,
    functionName: 'settle',
    args: [randomNumber],
    overrides: {
      gasLimit: BigNumber.from(10_000_000),
    }
  })
  const {write: settleWrite, status: settleStatus} = useContractWrite(settleConfig)

  useEffect(() => {
    if (balanceData && chequesData) {
      const balance = BigNumber.from(balanceData.value).add(BigNumber.from(chequesData))
      const formatted = balance.div(BigNumber.from(10).pow(BigNumber.from(cheque?.decimals || 0))).toNumber()
      setBalance(formatted.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      }))
    }
  }, [balanceData, cheque?.decimals, chequesData])

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

  const deal = (a: BaccaratBetType) => {
    if (!balanceData) {
      return;
    }

    if (betType === null) {
      if (Number(balanceData?.formatted) >= value + cheques[pickedCheque].value) {
        setBetType(a);
        setValue(value + cheques[pickedCheque].value);
      }
      return
    }
    if (betType === a) {
      if (Number(balanceData?.formatted) >= value + cheques[pickedCheque].value) {
        setValue(value + cheques[pickedCheque].value);
      }
    }
  }

  const getShoe = () => {
    return (
      <Stack h={'full'} minW={'320px'} w={'400px'} border={'2px solid white'} p={2} justify={"space-between"}>
        <HStack>
          <Text color={'blue.200'} fontWeight={'bold'}>Shoe</Text>
          <Spacer/>
          <Button variant={"solid"} colorScheme={'blue'} onClick={() => shuffleWrite?.()}
                  isLoading={shuffleStatus === 'loading'} loadingText={'Pending...'}
          >Shuffle</Button>
        </HStack>
        <Wrap justify={'center'} overflow={'scroll'} maxH={'500px'}>
          {
            // @ts-ignore
            cards.length > 0 && cards.map((item: {
              rank: BigNumber,
              suit: BigNumber,
            }, index: number) => (
              <WrapItem key={index}>
                <MiniPocker suit={item.suit} rank={item.rank} hidden={!showCard}/>
              </WrapItem>
            ))
          }
        </Wrap>
        {/*@ts-ignore*/}
        <HStack>
          <Text color={'blue.200'} fontWeight={'semibold'} fontSize={'sm'}>
            {/*@ts-ignore*/}
            Left: {cards?.length || 0} Cards
          </Text>
          <Spacer/>
          <IconButton aria-label={'refresh'} variant={'ghost'} color={'blue.200'}
                      borderRadius={'full'} size={'sm'}
                      onClick={() => {
                        setShowCard(!showCard)
                      }}
                      icon={showCard ? <ViewOffIcon/> : <ViewIcon/>}/>
        </HStack>
      </Stack>
    )
  }

  const getLayout = () => {
    return (
      <Stack h={'full'} border={'2px solid white'} spacing={0}>
        <HStack borderBottom={'1px solid white'} h={'80px'} spacing={0}>
          <Stack w={'280px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                 cursor={'pointer'} userSelect={'none'} spacing={0} onClick={() => deal(BaccaratBetType.Tie)}>
            <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>T</Text>
            <Text color={'blue.200'} fontSize={'sm'}>1:8</Text>
            <Cheque value={value} hidden={betType !== BaccaratBetType.Tie} width={'280px'} height={'80px'}
                    odds={9}/>
          </Stack>
          <Stack w={'120px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.SuperSix)}>
            <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>6</Text>
            <Text color={'blue.200'} fontSize={'sm'}>1:12</Text>
            <Cheque value={value} hidden={betType !== BaccaratBetType.SuperSix} width={'120px'} height={'80px'}
                    odds={13}/>
          </Stack>
        </HStack>
        <HStack borderBottom={'1px solid white'} h={'160px'} spacing={0}>
          <Stack w={'280px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.Banker)}
                 spacing={0}>
            <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'}>B</Text>
            <Text color={'red.200'} fontSize={'sm'}>1:0.95</Text>
            <Cheque value={value} hidden={betType !== BaccaratBetType.Banker} width={'280px'} height={'160px'}
                    odds={1.95}/>
          </Stack>
          <Stack w={'120px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.BankerPair)}>
            <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>B PAIR</Text>
            <Text color={'red.200'} fontSize={'sm'}>1:11</Text>
            <Cheque value={value} hidden={betType !== BaccaratBetType.BankerPair} width={'120px'} height={'160px'}
                    odds={12}/>
          </Stack>
        </HStack>
        <HStack h={'160px'} borderBottom={'1px solid white'} spacing={0}>
          <Stack w={'280px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.Player)}
                 spacing={0}>
            <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>P</Text>
            <Text color={'blue.200'} fontSize={'sm'}>1:1</Text>
            <Cheque value={value} hidden={betType !== BaccaratBetType.Player} width={'280px'} height={'160px'}
                    odds={2}/>
          </Stack>
          <Stack w={'120px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.PlayerPair)}>
            <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>P PAIR</Text>
            <Text color={'blue.200'} fontSize={'sm'}>1:11</Text>
            <Cheque value={value} hidden={betType !== BaccaratBetType.PlayerPair} width={'120px'} height={'160px'}
                    odds={12}/>
          </Stack>
        </HStack>
        <Stack px={2} h={'240px'} alignItems={"center"} p={2}>
          <HStack justifyContent={"space-between"} w={'full'} spacing={0}>
            <Text fontWeight={'bold'} color={'blue.200'}>My Cheques</Text>
            <PickTokenModal/>
          </HStack>
          <Stack alignItems={"center"} justify={"center"} h={'full'}>
            <HStack spacing={'20px'}>
              {
                cheques.filter((item) => {
                  if (balanceData) {
                    return item.value <= Number(balanceData?.formatted)
                  }
                  return true
                }).map((item, index) => (
                  <ChakraBox
                    key={index}
                    dragConstraints={{
                      top: -100,
                      left: -100,
                      right: 100,
                      bottom: 100,
                    }}
                    whileHover={{scale: 1.2, transition: {duration: 0.2}}}
                    whileTap={{scale: 0.9}}
                    whileDrag={{scale: 1.2}}
                    onDragEnd={
                      (event, info) => console.log(info.point.x, info.point.y)
                    }
                    drag={true}
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
                    <Text fontWeight={'bold'} textDecoration={pickedCheque === index ? 'underline' : ''} color={item.color}>{item.label}</Text>
                  </ChakraBox>
                )).slice(-5)
              }
            </HStack>
            <Text fontSize={'2xl'} color={'blue.200'} fontWeight={'bold'}>
              {balance} {value > 0 && `- ${value.toLocaleString('en-US', {
              maximumFractionDigits: 2,
            })}`} {cheque.symbol}
            </Text>
          </Stack>
          <Spacer/>
          <HStack>
            {cheque.address !== AddressZero && address && (
              <ApproveERC20Button token={cheque.address} owner={address} spender={BACCARAT_ADDRESS[chain?.id || 5]}
                                  spendAmount={spendAmount}/>
            )}
            {value > 0 && (
              <Button variant={"solid"} colorScheme={'blue'} isLoading={actionStatus === 'loading'}
                      loadingText={'Pending...'}
                      onClick={() => actionWrite?.()}>
                Action
              </Button>
            )}
            {value > 0 && (
              <Button variant={"solid"} colorScheme={'red'}
                      onClick={() => {
                        setBetType(null)
                        setValue(0)
                      }}>
                Clear
              </Button>
            )}
          </HStack>
        </Stack>
      </Stack>
    )
  }

  const getActions = () => {
    return (
      <Stack h={'40%'} w={'400px'} border={'2px solid white'} overflow={'scroll'}>
        {
          // @ts-ignore
          layoutData?.length > 0 ? (
            <Table variant='striped' colorScheme='blackAlpha'>
              <Tbody>
                {
                  // @ts-ignore
                  layoutData && layoutData?.map((item: {
                    amount: BigNumber,
                    betType: BigNumber,
                    player: Address,
                    token: Address
                  }, index: number) => (
                    <LayoutItem key={index} index={index + 1} amount={item.amount} betType={item.betType}
                                player={item.player} token={item.token}/>
                  ))
                }
              </Tbody>
            </Table>
          ) : (
            <Text color={'blue.200'} fontWeight={'bold'} p={2}>No actions.</Text>
          )
        }
      </Stack>
    )
  }

  const getHistory = () => {
    return (
      <Stack h={'60%'} w={'400px'} border={'2px solid white'} p={2}>
        <Text color={'blue.200'} fontWeight={'bold'}>History</Text>
        <Wrap>
          <WrapItem>
            <HistoryBall banker={true} player={false} tie={false} bPair={true} pPair={false} super6={true}/>
          </WrapItem>
          <WrapItem>
            <HistoryBall banker={true} player={false} tie={false} bPair={false} pPair={false} super6={false}/>
          </WrapItem>
        </Wrap>
      </Stack>
    )
  }

  const getLastHands = () => {
    return (
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
            <ChakraBox
              key={index}
              whileHover={{scale: 1.2, transition: {duration: 0.2}}}
              whileTap={{scale: 0.9}}
              whileDrag={{scale: 1.2}}
            >
              <Stack w={'57px'} h={'88px'} border={'1px solid white'} borderRadius={'6px'} p={1} justify={"center"}
                     cursor={'pointer'} bg={'blue.500'} boxShadow={'md'} userSelect={"none"}>
                {/*<Text fontSize={'xs'} fontWeight={'bold'}*/}
                {/*      color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>*/}
                {/*<Text fontSize={'xl'} textAlign={"center"}*/}
                {/*      color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.suit}</Text>*/}
                {/*<Text fontSize={'xs'} fontWeight={'bold'} transform={'rotate(180deg)'}*/}
                {/*      color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>*/}
              </Stack>
            </ChakraBox>
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
            <ChakraBox
              key={index}
              whileHover={{scale: 1.2, transition: {duration: 0.2}}}
              whileTap={{scale: 0.9}}
              whileDrag={{scale: 1.2}}
            >
              <Stack w={'57px'} h={'88px'} border={'1px solid white'} borderRadius={'6px'} p={1}
                     justify={"center"} cursor={'pointer'}
                     bg={'blue.500'} boxShadow={'md'} userSelect={"none"}>
                {/*<Text fontSize={'xs'} fontWeight={'bold'}*/}
                {/*      color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>*/}
                {/*<Text fontSize={'xl'} textAlign={"center"}*/}
                {/*      color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.suit}</Text>*/}
                {/*<Text fontSize={'xs'} fontWeight={'bold'} transform={'rotate(180deg)'}*/}
                {/*      color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>*/}
              </Stack>
            </ChakraBox>
          ))
        }
      </HStack>
    )
  }

  // @ts-ignore
  return (
    <Stack h={'100vh'} w={'full'} spacing={0} overflow={'auto'} bg={"blue.600"}>
      <TheHeader/>
      <Stack p={'20px'} spacing={'20px'} justify={"center"}>
        <HStack justify={"space-around"}>
          <Text w={'120px'} color={'white'} fontWeight={'bold'}>
            Baccarat
          </Text>
          {getLastHands()}
          <Button variant={"solid"} w={'120px'} colorScheme={'blue'} isLoading={settleStatus === 'loading'}
                  loadingText={'Pending...'}
                  onClick={() => settleWrite?.()}>
            Settle
          </Button>
        </HStack>
        <HStack justify={"center"} alignItems={"start"} spacing={'40px'}>
          <Stack h={'full'}>
            {getActions()}
            {getHistory()}
          </Stack>
          {getLayout()}
          {getShoe()}
        </HStack>
      </Stack>
    </Stack>
  )
}

export default Baccarat