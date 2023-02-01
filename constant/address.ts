import {Address} from "wagmi";
import {bscTestnet, goerli} from "wagmi/chains";

export const BACCARAT_ADDRESS: {[p: number]: Address} = {
  [goerli.id]: '0xda10F7A4DC8ffaa45E4F2C5e4265f3F156A0f8A4',
  [bscTestnet.id]: '0x3dde8a4615e66bc0174befcb987b7db901585b01',
}