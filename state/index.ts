import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";

const { persistAtom } = recoilPersist()

export const tokenAtom = atom({
  key: 'token',
  default: '',
  effects_UNSTABLE: [persistAtom],
})
