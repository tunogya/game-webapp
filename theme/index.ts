import { extendTheme } from '@chakra-ui/react'
import styles from './styles'
import Button from './components/button'
import Text from './components/text'
import Heading from "./components/heading";

const overrides = {
  styles,
  components: {
    Button,
    Text,
    Heading,
  },
}

export default extendTheme(overrides)