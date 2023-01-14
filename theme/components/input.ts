import { defineStyleConfig } from '@chakra-ui/react'

const Input = defineStyleConfig({
  baseStyle: {},
  variants: {
    filled: {
      field: {
        fontFamily: 'Montserrat',
        borderRadius: '6px',
        height: '40px',
        borderWidth: '2px',
        fontSize: 'md',
        fontWeight: '600',
        _focus: {
        },
        _hover: {
        },
      },
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'filled',
  }
})

export default Input