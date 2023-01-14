import { defineStyleConfig } from '@chakra-ui/react'

const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: '6px',
    fontFamily: 'Montserrat',
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