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
  WrapItem, Link
} from "@chakra-ui/react";
import TheHeader from "../../components/TheHeader";
import HistoryBall from "../../components/Baccarat/HistoryBall";
import {useCallback, useEffect, useMemo, useState} from "react";
import {isValidMotionProp, motion} from 'framer-motion'
import Cheque, {BaccaratBetType} from "../../components/Baccarat/Cheque";
import PickTokenModal from "../../components/Baccarat/PickTokenModal";
import {useRecoilValue} from "recoil";
import {baccaratChequeAtom, ChequeType} from "../../state";
import {
  Address,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite, useFeeData,
  useNetwork,
  usePrepareContractWrite, useWaitForTransaction
} from "wagmi";
import {AddressZero} from "@ethersproject/constants";
import ApproveERC20Button from "../../components/ApproveERC20Button";
import {BACCARAT_ADDRESS} from "../../constant/address";
import {BigNumber, ethers} from "ethers";
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
  const [cheque, setCheque] = useState<ChequeType | undefined>(undefined)
  const {data: balanceData} = useBalance({
    chainId: chain?.id,
    address: address,
    token: cheque?.address === AddressZero ? undefined : cheque?.address,
    watch: true,
  });
  const [balance, setBalance] = useState('');
  const chequeTokenData = useRecoilValue(baccaratChequeAtom);
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
  })
  const {data: chequesData} = useContractRead({
    ...baccaratContract,
    functionName: 'chequesOf',
    args: [address, cheque?.address],
    watch: true,
  })
  const {data: layoutData} = useContractRead({
    ...baccaratContract,
    functionName: 'layout',
    watch: true,
  })
  const {data: cardsData} = useContractRead({
    ...baccaratContract,
    functionName: 'shoe',
    watch: true,
  })
  const {data: resultsData} = useContractRead({
    ...baccaratContract,
    functionName: 'results',
  })
  const [showCard, setShowCard] = useState(true)
  const [cards, setCards] = useState([])
  const [layout, setLayout] = useState([])
  const [canSettle, setCanSettle] = useState(false)
  const {data: feeData} = useFeeData({
    chainId: chain?.id,
    formatUnits: 'gwei',
    watch: true,
  })

  useEffect(() => {
    if (chequeTokenData) {
      setCheque(chequeTokenData)
    }
  }, [chequeTokenData])

  const refreshCards = useCallback(() => {
    if (cardsData && cursorData) {
      // @ts-ignore
      setCards(cardsData.filter((item, index) => {
        return BigNumber.from(cursorData).lte(index)
      }))
    }
  }, [cardsData, cursorData])

  useEffect(() => {
    refreshCards()
  }, [refreshCards])

  useEffect(() => {
    if (layoutData) {
      // @ts-ignore
      setLayout(layoutData)
      let banker = false;
      let player = false;
      // @ts-ignore
      for (let i = 0; i < layoutData.length; i++) {
        // @ts-ignore
        const item = layoutData[i]
        if (item.betType.eq(0)) {
          banker = true
        }
        if (item.betType.eq(1)) {
          player = true
        }
        setCanSettle(banker && player)
      }
    }
  }, [layoutData])

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
    args: [cheque?.address, spendAmount, _betType],
    overrides: {
      value: cheque?.address === AddressZero ? BigNumber.from(spendAmount).mul(BigNumber.from(chequesData || 0)) : 0,
    },
  })
  const {data: actionData, write: actionWrite, status: actionStatus} = useContractWrite(actionConfig)
  const { status: actionStatus2 } = useWaitForTransaction({
    hash: actionData?.hash,
  })
  const randomNumber = useMemo(() => {
    const randomBytes = ethers.utils.randomBytes(32)
    return BigNumber.from(randomBytes)
  }, [])
  const {config: shuffleConfig} = usePrepareContractWrite({
    ...baccaratContract,
    functionName: 'shuffle',
    args: [randomNumber],
  })
  const {data: shuffleData, write: shuffleWrite, status: shuffleStatus} = useContractWrite(shuffleConfig)
  const {status: shuffleStatus2 } = useWaitForTransaction({
    hash: shuffleData?.hash,
  })
  const {config: settleConfig} = usePrepareContractWrite({
    ...baccaratContract,
    functionName: 'settle',
    args: [randomNumber],
  })
  const {data: settleData, write: settleWrite, status: settleStatus} = useContractWrite(settleConfig)
  const {status: settleStatus2 } = useWaitForTransaction({
    hash: settleData?.hash,
  })
  const [fee, setFee] = useState<{
    gasPrice: string | null,
    maxFeePerGas: string | null,
    maxPriorityFeePerGas: string | null
  } | null>(null)
  const [contractLink, setContractLink] = useState('')

  useEffect(() => {
    if (actionStatus2 === 'success') {
      setBetType(null)
      setValue(0)
    }
  }, [actionStatus2])

  useEffect(() => {
    if (feeData) {
      setFee({
        gasPrice: Number(feeData?.formatted.gasPrice).toLocaleString(),
        maxFeePerGas: Number(feeData?.formatted.maxFeePerGas).toLocaleString(),
        maxPriorityFeePerGas: Number(feeData?.formatted.maxPriorityFeePerGas).toLocaleString(),
      })
    }
  }, [feeData])

  useEffect(() => {
    if (chain) {
      setContractLink(`${chain?.blockExplorers?.default.url}/address/${BACCARAT_ADDRESS[chain?.id || 5]}`)
    }
  }, [chain])

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
      <Stack h={'full'} minW={'400px'} w={'400px'} border={'2px solid white'} p={2} justify={"space-between"}>
        <HStack>
          <Text color={'blue.200'} fontWeight={'bold'}>Shoe</Text>
          <Spacer/>
          <Button variant={"solid"} colorScheme={'blue'} onClick={() => shuffleWrite?.()}
                  isLoading={shuffleStatus === 'loading' || shuffleStatus2 === 'loading'} loadingText={'Pending...'}
          >Shuffle</Button>
        </HStack>
        <Wrap justify={'center'} overflow={'scroll'} maxH={'520px'} py={1}>
          {
            // @ts-ignore
            cards.length > 0 && cards.map((item: BigNumber, index: number) => (
              <WrapItem key={index}>
                <MiniPocker id={item} hidden={!showCard}/>
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
                  if (balance) {
                    return item.value <= Number(balance)
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
                    <Text fontWeight={'bold'} textDecoration={pickedCheque === index ? 'underline' : ''}
                          color={item.color}>{item.label}</Text>
                  </ChakraBox>
                )).slice(-5)
              }
            </HStack>
            <Text fontSize={'2xl'} color={'blue.200'} fontWeight={'bold'}>
              {balance} {value > 0 && `- ${value.toLocaleString()}`}
              {cheque && cheque.symbol}
            </Text>
          </Stack>
          <Spacer/>
          <HStack>
            {cheque && cheque?.address !== AddressZero && address && (
              <ApproveERC20Button token={cheque?.address} owner={address} spender={BACCARAT_ADDRESS[chain?.id || 5]}
                                  spendAmount={spendAmount}/>
            )}
            {value > 0 && (
              <Button variant={"solid"} colorScheme={'blue'} isLoading={actionStatus === 'loading' || actionStatus2 === 'loading'}
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
          layout?.length > 0 ? (
            <Table variant='striped' colorScheme='blackAlpha'>
              <Tbody>
                {
                  layout?.map((item: {
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
    <Stack h={'100vh'} w={'full'} spacing={0} overflow={'auto'} bg={"blue.600"} align={"center"}>
      <TheHeader/>
      <Stack p={'20px'} maxW={'container.xl'} spacing={'20px'} justify={"center"}>
        <HStack justify={"space-around"}>
          <Text w={'120px'} color={'white'} fontWeight={'bold'}>
            Baccarat
          </Text>
          {getLastHands()}
          <Button variant={"solid"} w={'120px'} colorScheme={'blue'} isLoading={settleStatus === 'loading' || settleStatus2 === 'loading'}
                  loadingText={'Pending...'} disabled={!canSettle}
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
      <HStack maxW={'container.xl'} w={'full'} fontWeight={'semibold'} fontSize={'xs'} justify={"space-between"}>
        <Text color={'blue.200'}>Contract: <Link isExternal textDecoration={'underline'}
                                                 href={contractLink}>
          {BACCARAT_ADDRESS[chain?.id || 5]}
        </Link></Text>
        <Text color={'blue.200'}>
          Gas
          Price: {fee?.gasPrice} gwei, {fee?.maxFeePerGas} gwei, {fee?.maxPriorityFeePerGas} gwei</Text>
      </HStack>
    </Stack>
  )
}

export default Baccarat