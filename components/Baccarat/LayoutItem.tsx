import {Td, Tr} from "@chakra-ui/react";
import {BigNumber} from "ethers";
import {Address, useNetwork, useToken} from "wagmi";
import {FC, useMemo} from "react";

type LayoutItemProps = {
  index: number;
  amount: BigNumber;
  betType: BigNumber;
  player: Address;
  token: Address;
}

const LayoutItem: FC<LayoutItemProps> = (props) => {
  const { chain } = useNetwork()
  const {index, amount, betType, player, token} = props
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
    address: token,
  })
  const amountString = useMemo(() => {
    if (tokenData) {
      return BigNumber.from(amount).div(BigNumber.from(10).pow(tokenData?.decimals || 0)).toString()
    }
    return '-'
  }, [amount, tokenData])

  return (
    <Tr>
      <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>{index}</Td>
      <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>{player.slice(0, 6)}...{player.slice(-4)}</Td>
      <Td fontSize={'xs'} color={'white'} fontWeight={'500'}>{betTypeString}</Td>
      <Td fontSize={'xs'} color={'white'} fontWeight={'500'} isNumeric>{Number(amountString).toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })} {tokenData?.symbol}</Td>
    </Tr>
  )
}

export default LayoutItem