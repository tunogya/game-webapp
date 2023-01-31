import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";
import {Address} from "wagmi";
import {AddressZero} from "@ethersproject/constants";

const { persistAtom } = recoilPersist()

export const tokenAtom = atom({
  key: 'token',
  default: AddressZero,
  effects_UNSTABLE: [persistAtom],
})

export type ChequeType = {
  chainId: number,
  address: Address,
  symbol: string,
  name: string,
  decimals: number,
}

export const baccaratChequeAtom = atom<ChequeType | undefined>({
  key: 'baccaratCheque',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
})