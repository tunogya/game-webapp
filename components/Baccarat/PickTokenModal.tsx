import {
  Button,
  FormControl, FormLabel, HStack, Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure
} from "@chakra-ui/react";
import {useState} from "react";
import {getAddress, isAddress} from "ethers/lib/utils";
import {useNetwork, useToken} from "wagmi";
import {useRecoilState} from "recoil";
import {baccaratChequeAtom} from "../../state";
import {AddressZero} from "@ethersproject/constants";

const PickTokenModal = () => {
  const { chain } = useNetwork()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [token, setToken] = useState("")
  const { data: tokenData, status: tokenStatus } = useToken({
    chainId: chain?.id,
    address: isAddress(token) ? token : undefined,
  })
  const [, setCheque] = useRecoilState(baccaratChequeAtom)

  return (
    <>
      <Button variant={"solid"} colorScheme={'blue'} onClick={onOpen}>
        Pick Token
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay/>
        <ModalContent borderRadius={12}>
          <ModalHeader fontSize={'md'} fontWeight={'bold'}>Pick a token as cheque</ModalHeader>
          <ModalCloseButton borderRadius={'full'}/>
          <ModalBody>
            <Stack>
              <FormControl isInvalid={(!!token && !isAddress(token) || tokenStatus === 'error')}>
                <FormLabel fontSize={'xs'}>
                  token: {tokenStatus === 'loading' && '(loading...)'} {tokenStatus === 'success' && `(${tokenData?.name}, ${tokenData?.symbol})`} {tokenStatus === 'error' && '(error token)'}
                </FormLabel>
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}/>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack justify={"space-between"} w={'full'}>
              <Button variant={'ghost'} onClick={() => {
                setCheque({
                  chainId: chain?.id || 0,
                  address: AddressZero,
                  decimals: chain?.nativeCurrency.decimals || 18,
                  name: chain?.nativeCurrency.name || '',
                  symbol: chain?.nativeCurrency.symbol || '',
                })
                onClose()
              }}>Pick Native Currency</Button>
              <Button disabled={!isAddress(token) || !tokenData} onClick={() => {
                if (tokenData) {
                  setCheque({
                    chainId: chain?.id || 0,
                    address: getAddress(token),
                    symbol: tokenData.symbol,
                    name: tokenData.name,
                    decimals: tokenData.decimals,
                  })
                  onClose()
                }
              }}>Pick</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default PickTokenModal