import {
  Stack,
  Text,
  Heading,
  Divider,
} from "@chakra-ui/react";
import TheHeader from "../../components/TheHeader";
import CreateDuneProjectModal from "../../components/CreateDuneProjectModal";
import Link from "next/link";

const Dashboard = () => {
  return (
    <Stack w={'full'} spacing={0}>
      <TheHeader/>
      <Stack px={40} py={10} spacing={10}>
        <Stack w={'50%'} h={'400px'} bg={'blue.200'} p={'20px'} borderRadius={'20px'} justify={"center"} alignItems={"center"}>
          <Link href={'/baccarat'}>
            <Heading>
              Baccarat
            </Heading>
          </Link>
        </Stack>
        <Divider/>
        <Stack w={'400px'}>
          <Heading fontSize={'xl'}>Create a dune project</Heading>
          <Text fontSize={'sm'}>Make your ERC20 token as spice!</Text>
          <br/>
          <CreateDuneProjectModal/>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Dashboard