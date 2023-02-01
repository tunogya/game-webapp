import {Td, Tr} from "@chakra-ui/react";
import {BigNumber} from "ethers";
import {Address, useNetwork, useToken} from "wagmi";
import {FC, useMemo, useState} from "react";
import {AddressZero} from "@ethersproject/constants";

type LayoutItemProps = {
  index: number;
  amount: BigNumber;
  betType: BigNumber;
  player: Address;
  token: Address;
}

const LayoutItem: FC<LayoutItemProps> = (props) => {
  const { chain } = useNetwork()
  const {amount, betType, player, token} = props
  const betTypeString = useMemo(() => {
    switch (betType.toNumber()) {
      case 0:
        return 'Banker'
      case 1:
        return 'Player'
      case 2:
        return 'Tie'
      case 3:
        return 'Banker Pair'
      case 4:
        return 'Player Pair'
      case 5:
        return 'Super Six'
      default:
        return 'Unknown'
    }
  }, [betType])
  const { data: tokenData } = useToken({
    chainId: chain?.id,
    address: token === AddressZero ? undefined : token,
  })
  const [symbol, setSymbol] = useState('')

  const amountString = useMemo(() => {
    if (token === AddressZero) {
      setSymbol(chain?.nativeCurrency.symbol || '')
      return BigNumber.from(amount).div(BigNumber.from(10).pow(12)).toNumber() / 1_000_000
    }
    if (tokenData) {
      setSymbol(tokenData.symbol)
      return BigNumber.from(amount).div(BigNumber.from(10).pow(tokenData?.decimals - 6 || 0)).toNumber() / 1_000_000
    }
    return 0
  }, [amount, chain?.nativeCurrency.symbol, token, tokenData])

  return (
    <Tr>
      <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>{player.slice(0, 6)}...{player.slice(-4)}</Td>
      <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>{betTypeString}</Td>
      <Td fontSize={'xs'} color={'white'} fontWeight={'500'} isNumeric>{amountString.toLocaleString()} {symbol}</Td>
    </Tr>
  )
}

export default LayoutItem