import {Button, HStack, Stack, Table, Tbody, Td, Text, Tr, Wrap, WrapItem} from "@chakra-ui/react";
import TheHeader from "../../components/TheHeader";
import HistoryBall, {BaccaratResult} from "../../components/Baccarat/HistoryBall";

const Baccarat = () => {
  return (
    <Stack h={'100vh'} w={'full'} spacing={0}>
      <TheHeader/>
      <Stack h={'full'} bg={"blue.600"} p={'40px'} spacing={'20px'}>
        <HStack justify={"space-around"}>
          <Button variant={"solid"}>
            Withdraw
          </Button>
          <HStack>
            {
              [
                {},{},{},{},{},{}
              ].map((item, index) => (
                <Stack key={index} w={'57px'} h={'88px'} border={'1px solid white'}>
                </Stack>
              ))
            }
          </HStack>
          <Button variant={"solid"}>
            Settle
          </Button>
        </HStack>
        <HStack h={'full'} justify={"space-around"}>
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
                  <HistoryBall result={BaccaratResult.Banker} bPair={true} pPair={false} super6={true} />
                </WrapItem>
                <WrapItem>
                  <HistoryBall result={BaccaratResult.Banker} bPair={false} pPair={false} super6={false} />
                </WrapItem>
              </Wrap>
            </Stack>
          </Stack>
          <Stack h={'full'} border={'2px solid white'}>
            <HStack borderBottom={'1px solid white'} h={'180px'}>
              <Stack w={'300px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"} spacing={0}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>TIE</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:8</Text>
              </Stack>
              <Stack w={'200px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'}>Super 6</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:12</Text>
              </Stack>
            </HStack>
            <HStack borderTop={'1px solid white'} borderBottom={'1px solid white'} h={'240px'}>
              <Stack w={'300px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"} spacing={0}>
                <Text color={'red.200'} fontWeight={'bold'} fontSize={'3xl'}>BANKER</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:0.95</Text>
              </Stack>
              <Stack w={'200px'} h={'full'} textAlign={"center"} justify={"center"} spacing={0}>
                <Text color={'blue.200'} fontWeight={'bold'} fontSize={'3xl'} lineHeight={'34px'}>BANKER PAIR</Text>
                <Text color={'blue.200'} fontSize={'sm'}>1:11</Text>
              </Stack>
            </HStack>
            <HStack borderTop={'1px solid white'} h={'240px'} borderBottom={'1px solid white'}>
              <Stack w={'300px'} h={'full'} borderRight={'1px solid white'} textAlign={"center"} justify={"center"} spacing={0}>
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
                <Button variant={"solid"}>
                  Pick Token
                </Button>
              </HStack>
            </Stack>
          </Stack>
          <Stack h={'full'} w={'400px'} border={'2px solid white'} p={2}>
            <HStack justifyContent={'space-between'}>
              <Text color={'blue.200'} fontWeight={'bold'}>Shoe</Text>
              <Button variant={"solid"} size={'sm'} colorScheme={'cyan'}>Shuffle</Button>
            </HStack>
            <Wrap justify={'center'}>
              {
                [
                  {},{},{},{},{},{},{},{},{},{},{},
                  {},{},{},{},{},{},{},{},{},{},{},
                  {},{},{},{},{},{},{},{},{},{},{},
                  {},{},{},{},{},{},{},{},{},{},{},
                  {},{},{},{},{},{},{},{},{},{},{},
                  {},{},{},{},{},{},{},{},{},{},{},
                ].map((item, index) => (
                  <WrapItem key={index}>
                    <Stack w={'29px'} h={'44px'} border={'1px solid white'}>
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