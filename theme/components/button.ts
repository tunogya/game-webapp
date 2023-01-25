import { defineStyleConfig } from '@chakra-ui/react'
import {Montserrat} from "@next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });

const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: '6px',
    fontFamily: montserrat.style.fontFamily,
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4,
      py: 3,
    },
    md: {
      fontSize: 'sm',
      px: 6,
      py: 4,
    },
  },
  variants: {
    outline: {
      border: '2px solid',
      borderColor: 'blue.500',
      color: 'blue.500',
    },
    solid: {
      bg: 'blue.500',
      color: 'white',
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
})

export default Button