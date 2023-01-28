import {Button} from "@chakra-ui/react";
import {erc20ABI} from '@wagmi/core'
import {Address, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {BigNumber} from "ethers";
import {MaxUint256} from "@ethersproject/constants";
import {FC, useCallback, useEffect, useState} from "react";

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
    watch: true,
  })
  const {config} = usePrepareContractWrite({
    ...tokenContract,
    functionName: 'approve',
    args: [spender, MaxUint256]
  })
  const {data: approveData, write: approveWrite, status: approveStatus} = useContractWrite(config)
  const {status: approveStatus2} = useWaitForTransaction({
    hash: approveData?.hash,
  })
  const [allowance, setAllowance] = useState(BigNumber.from(0))

  const refreshAllowance = useCallback(() => {
    if (allowanceData) {
      setAllowance(allowanceData)
    }
  }, [allowanceData])

  useEffect(() => {
    refreshAllowance()
  }, [refreshAllowance])

  return (
    <>
      {
        BigNumber.from(allowance).lt(BigNumber.from(spendAmount)) && (
          <Button variant={"solid"} colorScheme={'blue'} onClick={() => approveWrite?.()} w={'full'}
                  isLoading={approveStatus === 'loading' || approveStatus2 === 'loading'}>
            Approve
          </Button>
        )
      }
    </>
  )
}

export default ApproveERC20Button