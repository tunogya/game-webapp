import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";

const { persistAtom } = recoilPersist()

export const tokenAtom = atom({
  key: 'token',
  default: '',
  effects_UNSTABLE: [persistAtom],
})

export const baccaratChequeAtom = atom({
  key: 'baccaratCheque',
  default: {
    chainId: 1,
    address: '',
    symbol: '-',
    name: '-',
    decimals: 18,
  },
  effects_UNSTABLE: [persistAtom],
})