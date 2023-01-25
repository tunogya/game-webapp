import {Button, HStack, Stack, Table, Tbody, Td, Text, Tr, Wrap, WrapItem} from "@chakra-ui/react";
import TheHeader from "../../components/TheHeader";
import HistoryBall, {BaccaratResult} from "../../components/Baccarat/HistoryBall";

const Baccarat = () => {
  return (
    <Stack h={'100vh'} w={'full'} spacing={0}>
      <TheHeader/>
      <Stack h={'full'} bg={"blue.600"} p={'40px'} spacing={'20px'}>
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
                  <Text fontSize={'xs'} fontWeight={'bold'} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
                  <Text fontSize={'xl'} textAlign={"center"} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.suit}</Text>
                  <Text fontSize={'xs'} fontWeight={'bold'} transform={'rotate(180deg)'} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
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
                  <Text fontSize={'xs'} fontWeight={'bold'} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
                  <Text fontSize={'xl'} textAlign={"center"} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.suit}</Text>
                  <Text fontSize={'xs'} fontWeight={'bold'} transform={'rotate(180deg)'} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
                </Stack>
              ))
            }
          </HStack>
          <Button variant={"solid"} w={'120px'} colorScheme={'cyan'}>
            Settle
          </Button>
        </HStack>
        <HStack h={'full'} justify={"center"} spacing={'40px'}>
          <Stack h={'full'}>
            <Stack h={'40%'} w={'400px'} border={'2px solid white'} overflow={'scroll'}>
              <Table variant='striped' colorScheme='blackAlpha'>
                <Tbody>
                  <Tr>
                    <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>1</Td>
                    <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>0x1234...7892</Td>
                    <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>Banker</Td>
                    <Td fontSize={'xs'} color={'white'} fontWeight={'500'} isNumeric>25 NEST</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Stack>
            <Stack h={'60%'} w={'400px'} border={'2px solid white'} p={2}>
              <Text color={'blue.200'} fontWeight={'bold'}>History</Text>
              <Wrap>
                <WrapItem>
                  <HistoryBall result={BaccaratResult.Banker} bPair={true} pPair={false} super6={true}/>
                </WrapItem>
                <WrapItem>
                  <HistoryBall result={BaccaratResult.Banker} bPair={false} pPair={false} super6={false}/>
                </WrapItem>
              </Wrap>
            </Stack>
          </Stack>
          <Stack h={'full'} border={'2px solid white'}>
            <HStack borderBottom={'1px solid white'} h={'180px'}>
              <Stack w={'300px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                     spacing={0}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>TIE</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:8</Text>
              </Stack>
              <Stack w={'200px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>Super 6</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:12</Text>
              </Stack>
            </HStack>
            <HStack borderTop={'1px solid white'} borderBottom={'1px solid white'} h={'240px'}>
              <Stack w={'300px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                     spacing={0}>
                <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'}>BANKER</Text>
                <Text color={'red.200'} fontSize={'sm'}>1:0.95</Text>
              </Stack>
              <Stack w={'200px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}>
                <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>BANKER PAIR</Text>
                <Text color={'red.200'} fontSize={'sm'}>1:11</Text>
              </Stack>
            </HStack>
            <HStack borderTop={'1px solid white'} h={'240px'} borderBottom={'1px solid white'}>
              <Stack w={'300px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"}
                     spacing={0}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>PLAYER</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:1</Text>
              </Stack>
              <Stack w={'200px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>PLAYER PAIR</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:11</Text>
              </Stack>
            </HStack>
            <Stack px={2} h={'full'} alignItems={"center"}>
              <HStack justifyContent={"space-between"} w={'full'}>
                <Text fontWeight={'bold'} color={'blue.200'}>My Cheques</Text>
                <Button variant={"solid"} colorScheme={'cyan'}>
                  Pick Token
                </Button>
              </HStack>
            </Stack>
          </Stack>
          <Stack h={'full'} w={'400px'} border={'2px solid white'} p={2}>
            <HStack justifyContent={'space-between'}>
              <Text color={'blue.200'} fontWeight={'bold'}>Shoe</Text>
              <Button variant={"solid"} colorScheme={'cyan'}>Shuffle</Button>
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
                    <Stack w={'29px'} h={'44px'} border={'1px solid white'} borderRadius={'4px'} bg={'white'} spacing={0}
                           boxShadow={'sm'} p={'2px'} justify={"space-between"} userSelect={'none'}>
                      <Text fontSize={'xx-small'} lineHeight={'10px'} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.rank}</Text>
                      <Text fontSize={'sm'}  textAlign={"center"} lineHeight={'20px'} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'}>{item.suit}</Text>
                      <Text fontSize={'xx-small'} color={item.suit === '♦' || item.suit === '♥' ? 'red' : 'black'} lineHeight={'10px'} transform={'rotate(180deg)'}>{item.rank}</Text>
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