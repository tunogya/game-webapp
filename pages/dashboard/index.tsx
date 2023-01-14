import {
  Stack,
  Text,
  Heading,
  Divider,
} from "@chakra-ui/react";
import TheHeader from "../../components/TheHeader";
import CreateDuneProjectModal from "../../components/CreateDuneProjectModal";

const Dashboard = () => {
  return (
    <Stack w={'full'} spacing={0}>
      <TheHeader/>
      <Stack px={40} py={10}>
        <Stack w={'400px'}>
          <Heading fontSize={'xl'}>Create a dune project</Heading>
          <Text fontSize={'sm'}>Make your ERC20 token as spice!</Text>
          <br/>
          <CreateDuneProjectModal/>
        </Stack>
      </Stack>
      <Divider/>
    </Stack>
  )
}

export default Dashboard