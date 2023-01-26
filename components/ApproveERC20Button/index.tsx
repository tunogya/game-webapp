import {Button} from "@chakra-ui/react";
import {erc20ABI} from '@wagmi/core'
import {Address, useContractRead, useContractWrite, usePrepareContractWrite} from "wagmi";
import {BigNumber} from "ethers";
import {MaxUint256} from "@ethersproject/constants";
import {FC} from "react";

type ApproveERC20ButtonProps = {
  token: string,
  owner: Address,
  spender: Address,
  spendAmount: string,
}

const ApproveERC20Button: FC<ApproveERC20ButtonProps> = (props: any) => {
  const {token, owner, spender, spendAmount} = props
  const tokenContract = {
    address: token,
    abi: erc20ABI
  }
  const {data: allowanceData} = useContractRead({
    ...tokenContract,
    functionName: 'allowance',
    args: [owner, spender],
    cacheOnBlock: true,
  })
  const {config} = usePrepareContractWrite({
    ...tokenContract,
    functionName: 'approve',
    args: [spender, MaxUint256]
  })
  const {write: approve, status: approveStatus} = useContractWrite(config)

  return (
    <>
      {
        BigNumber.from(allowanceData || 0).lt(BigNumber.from(spendAmount)) && (
          <Button variant={"solid"} colorScheme={'blue'} onClick={() => approve?.()} w={'full'} isLoading={approveStatus === 'loading'} loadingText={"Approving..."}>
            Approve {approveStatus === 'success' && "Success"} {approveStatus === 'error' && "Error"}
          </Button>
        )
      }
    </>
  )
}

export default ApproveERC20Button