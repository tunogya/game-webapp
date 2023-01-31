import {
  Button,
  chakra,
  HStack,
  shouldForwardProp, Spacer,
  Stack,
  Table,
  Tbody,
  Text,
  Wrap,
  WrapItem, Link, Tooltip
} from "@chakra-ui/react";
import TheHeader from "../../components/TheHeader";
import HistoryBall, {ResultType} from "../../components/Baccarat/HistoryBall";
import {useEffect, useMemo, useState} from "react";
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
  useContractWrite,
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
  const [balanceAndCheques, setBalanceAndCheques] = useState({
    balance: 0,
    cheques: 0,
    total: 0
  });
  const chequeTokenData = useRecoilValue(baccaratChequeAtom);
  const spendAmount = useMemo(() => {
    return BigNumber.from(value).mul(BigNumber.from(10).pow(BigNumber.from(cheque?.decimals || 0))).toString()
  }, [cheque, value])
  const baccaratContract = {
    address: BACCARAT_ADDRESS[chain?.id || 5],
    abi: BACCARAT_ABI
  }
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
  const {data: resultsData} = useContractRead({
    ...baccaratContract,
    functionName: 'results',
    watch: true,
  })
  const [layout, setLayout] = useState([])
  const [canSettle, setCanSettle] = useState(false)
  const [results, setResults] = useState<ResultType[]>([])

  useEffect(() => {
    if (resultsData) {
      // @ts-ignore
      setResults(resultsData)
    }
  }, [resultsData])

  useEffect(() => {
    if (chequeTokenData) {
      setCheque(chequeTokenData)
    }
  }, [chequeTokenData])

  useEffect(() => {
    if (layoutData) {
      // @ts-ignore
      setLayout(layoutData)
      // @ts-ignore
      setCanSettle(layoutData.length >= 2)
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
      value: cheque?.address === AddressZero ? BigNumber.from(spendAmount).sub(BigNumber.from(chequesData || 0)) : 0,
      gasLimit: BigNumber.from(200_000),
    },
  })
  const {data: actionData, write: actionWrite, status: actionStatus} = useContractWrite(actionConfig)
  const {status: actionStatus2} = useWaitForTransaction({
    hash: actionData?.hash,
  })
  const randomNumber = useMemo(() => {
    const randomBytes = ethers.utils.randomBytes(32)
    return BigNumber.from(randomBytes)
  }, [])
  const {config: settleConfig} = usePrepareContractWrite({
    ...baccaratContract,
    functionName: 'settle',
    args: [randomNumber],
    overrides: {
      gasLimit: BigNumber.from(1_000_000),
    }
  })
  const {data: settleData, write: settleWrite, status: settleStatus} = useContractWrite(settleConfig)
  const {status: settleStatus2} = useWaitForTransaction({
    hash: settleData?.hash,
  })
  const [contractLink, setContractLink] = useState('')

  useEffect(() => {
    if (actionStatus2 === 'success') {
      setBetType(null)
      setValue(0)
    }
  }, [actionStatus2])

  useEffect(() => {
    if (chain) {
      setContractLink(`${chain?.blockExplorers?.default.url}/address/${BACCARAT_ADDRESS[chain?.id || 5]}`)
    }
  }, [chain])

  useEffect(() => {
    if (balanceData && chequesData) {
      setBalanceAndCheques({
        balance: BigNumber.from(balanceData.value).div(BigNumber.from(10).pow(BigNumber.from(cheque?.decimals || 0))).toNumber(),
        cheques: BigNumber.from(chequesData).div(BigNumber.from(10).pow(BigNumber.from(cheque?.decimals || 0))).toNumber(),
        total: BigNumber.from(balanceData.value).add(BigNumber.from(chequesData)).div(BigNumber.from(10).pow(BigNumber.from(cheque?.decimals || 0))).toNumber()
      })
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

  const getLayout = () => {
    return (
      <Stack w={'full'} border={'2px solid white'} spacing={0}>
        <HStack borderBottom={'1px solid white'} h={'80px'} spacing={0}>
          <Stack w={'70%'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                 cursor={'pointer'} userSelect={'none'} spacing={0} onClick={() => deal(BaccaratBetType.Tie)}>
            {betType === BaccaratBetType.Tie ? (
              <Cheque value={value} odds={9}/>
            ) : (
              <>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>T</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:8</Text>
              </>
            )}
          </Stack>
          <Stack w={'30%'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.SuperSix)}>
            {betType === BaccaratBetType.SuperSix ? (
              <Cheque value={value} odds={13}/>
            ) : (
              <>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>6</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:12</Text>
              </>
            )}
          </Stack>
        </HStack>
        <HStack borderBottom={'1px solid white'} h={'160px'} spacing={0}>
          <Stack w={'70%'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.Banker)}
                 spacing={0}>
            {
              betType === BaccaratBetType.Banker ? (
                <Cheque value={value} odds={1.95}/>
              ) : (
                <>
                  <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'}>B</Text>
                  <Text color={'red.200'} fontSize={'sm'}>1:0.95</Text>
                </>
              )
            }
          </Stack>
          <Stack w={'30%'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.BankerPair)}>
            {betType === BaccaratBetType.BankerPair ? (
              <Cheque value={value} odds={12}/>
            ) : (
              <>
                <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>B PAIR</Text>
                <Text color={'red.200'} fontSize={'sm'}>1:11</Text>
              </>
            )}
          </Stack>
        </HStack>
        <HStack h={'160px'} borderBottom={'1px solid white'} spacing={0}>
          <Stack w={'70%'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.Player)}
                 spacing={0}>
            {betType === BaccaratBetType.Player ? (
              <Cheque value={value} odds={2}/>
            ) : (
              <>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>P</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:1</Text>
              </>
            )}
          </Stack>
          <Stack w={'30%'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}
                 cursor={'pointer'} userSelect={'none'} onClick={() => deal(BaccaratBetType.PlayerPair)}>
            {betType === BaccaratBetType.PlayerPair ? (
              <Cheque value={value} odds={12}/>
            ) : (
              <>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>P PAIR</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:11</Text>
              </>
            )}
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
                  if (balanceAndCheques) {
                    return item.value <= balanceAndCheques.total
                  }
                  return false
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
            <Tooltip
              label={`balance: ${balanceAndCheques.balance.toLocaleString()} ${cheque && cheque.symbol}, cheques: ${balanceAndCheques.cheques.toLocaleString()} ${cheque && cheque.symbol}`}>
              <Text fontSize={'2xl'} color={'blue.200'} fontWeight={'bold'} cursor={'pointer'}>
                {balanceAndCheques.total.toLocaleString()} {value > 0 && `- ${value.toLocaleString()}`}
                {cheque && cheque.symbol}
              </Text>
            </Tooltip>
          </Stack>
          <Spacer/>
          <HStack>
            {cheque && cheque?.address !== AddressZero && address && (
              <ApproveERC20Button token={cheque?.address} owner={address} spender={BACCARAT_ADDRESS[chain?.id || 5]}
                                  spendAmount={spendAmount}/>
            )}
            {value > 0 && (
              <Button variant={"solid"} colorScheme={'blue'}
                      isLoading={actionStatus === 'loading' || actionStatus2 === 'loading'}
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
      <Stack w={'full'} border={'2px solid white'} overflow={'scroll'}>
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
                  )).reverse()
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
      <Wrap w={'full'} border={'2px solid white'} p={2}>
        {
          results.length > 0 ? results.map((item, index) => (
            <WrapItem key={index}>
              <HistoryBall index={index} result={item}/>
            </WrapItem>
          )).reverse() : (
            <Text color={'blue.200'} fontWeight={'bold'}>No history.</Text>
          )
        }
      </Wrap>
    )
  }

  const getLastHands = () => {
    return (
      <HStack spacing={4}>
        <HStack>
          {
            [
              results[results.length - 1]?.bankerHands1 || 0,
              results[results.length - 1]?.bankerHands2 || 0,
              results[results.length - 1]?.bankerHands3 || 0,
            ].map((item, index) => (
              <MiniPocker id={item} key={index}/>
            ))
          }
        </HStack>
        <Text color={'red.200'} fontWeight={'bold'}>B</Text>
        <Stack w={'1px'} h={'40px'} bg={'white'}></Stack>
        <Text color={'blue.200'} fontWeight={'bold'}>P</Text>
        <HStack>
          {
            [
              results[results.length - 1]?.playerHands1 || 0,
              results[results.length - 1]?.playerHands2 || 0,
              results[results.length - 1]?.playerHands3 || 0,
            ].map((item, index) => (
              <MiniPocker id={item} key={index}/>
            ))
          }
        </HStack>
      </HStack>
    )
  }

  const suttleButton = () => {
    return (
      <Button variant={"solid"} w={'120px'} colorScheme={'blue'}
              isLoading={settleStatus === 'loading' || settleStatus2 === 'loading'}
              loadingText={'Pending...'} disabled={!canSettle}
              onClick={() => settleWrite?.()}>
        Settle
      </Button>
    )
  }

  // @ts-ignore
  return (
    <Stack w={'full'} minH={'100vh'} spacing={0} overflow={'scroll'} bg={"blue.600"} align={"center"}>
      <TheHeader/>
      <Stack p={[2, 4, 6, 8]} w={['full', 'container.sm']} spacing={[4,6,8]} justify={"center"} align={"center"}>
        <HStack spacing={'100px'} w={'full'} justify={['space-between', 'center']}>
          <Text color={'white'} fontWeight={'bold'} fontSize={['md', 'xl', '2xl']}>
            Baccarat
          </Text>
          {suttleButton()}
        </HStack>
        {getLastHands()}
        <Text color={'blue.200'} fontSize={'xs'}>Contract: <Link isExternal textDecoration={'underline'}
                                                                 href={contractLink}>
          {BACCARAT_ADDRESS[chain?.id || 5]}
        </Link></Text>
        {getLayout()}
        {getActions()}
        {getHistory()}
      </Stack>
    </Stack>
  )
}

export default Baccarat