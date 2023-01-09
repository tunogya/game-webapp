import {defineStyleConfig} from "@chakra-ui/react";
import localFont from '@next/font/local'
import {Montserrat} from "@next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });

const DuneRise = localFont({
  src: './DuneRise.ttf',
})

const Heading = defineStyleConfig({
  baseStyle: {
    fontFamily: `${DuneRise.style.fontFamily}, ${montserrat.style.fontFamily}`,
  }
})

export default Heading