import {
  Grid,
  GridItem,
  Button,
  Heading,
  Flex,
  Text,
  IconButton,
  CircularProgress,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { rword } from 'rword';
import React from 'react';
import {
  useSigner,
  useContract,
  useConnect,
  useAccount,
  useDisconnect,
} from 'wagmi';
import address from '../utils/address.json';
import abi from '../utils/abi.json';
import { getCalldata } from '../utils/zk';

function IndexPage() {
  const [matrix, setMatrix] = React.useState([]);
  const [word, setWord] = React.useState('');
  const [selectedRow, setSelectedRow] = React.useState(-1);

  const [loading, setLoading] = React.useState(true);

  const generateWord = () => {
    setLoading(true);
    const words = rword.generate(4, { length: 4 });
    const index = Math.floor(Math.random() * 4);

    setWord(words[index]);
    const arr = Array(16);
    for (let i = 0; i < 16; i++) arr[i] = words[Math.floor(i / 4)][i % 4];
    setMatrix(arr);

    setLoading(false);
  };

  React.useEffect(() => {
    generateWord();
  }, []);

  const { connectAsync, connectors } = useConnect();
  const {
    data: accountData,
    // isError: accountError,
    // isLoading: accountLoading,
  } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: signerData } = useSigner();

  const contract = useContract({
    addressOrName: address.address,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const onSubmit = async () => {
    if (!accountData) {
      return;
    }
    const ogGrid = Array(4);
    for (let i = 0; i < 4; i++) ogGrid[i] = Array(4);

    const selectedGrid = Array(4);
    for (let i = 0; i < 4; i++) selectedGrid[i] = Array(4).fill(0);

    const subGrid = Array(4);
    for (let i = 0; i < 4; i++) subGrid[i] = Array(4).fill(0);

    for (let i = 0; i < 16; i++) {
      ogGrid[Math.floor(i / 4)][i % 4] = matrix[i].charCodeAt(0) - 32;
    }
    for (let i = 0; i < 4; i++) {
      selectedGrid[selectedRow][i] = ogGrid[selectedRow][i];
      subGrid[selectedRow][i] = 1;
    }

    const wordMatrix = Array(4);
    const selectedWord = Array(4);
    for (let i = 0; i < 4; i++) {
      wordMatrix[i] = word[i].charCodeAt(0) - 32;
      selectedWord[i] = matrix[selectedRow * 4 + i].charCodeAt(0) - 32;
    }

    console.log(ogGrid);
    console.log(selectedGrid);
    console.log(subGrid);
    console.log(selectedWord);
    console.log(wordMatrix);

    const calldata = await getCalldata(ogGrid, selectedGrid, subGrid, selectedWord, wordMatrix);
    if (calldata) {
      console.log(calldata);
      console.log(await signerData.provider.getCode(address.address));
      const result = await contract.verifyProof(
        calldata[0],
        calldata[1],
        calldata[2],
        calldata[3],
      );
      console.log(result);
    }
  };

  const refresh = () => {
    setSelectedRow(-1);
    generateWord();
  };

  React.useEffect(() => {
    console.log('Selected row:', selectedRow);
  }, [selectedRow]);

  return (
    <Flex w="100%" h="100vh" bg="#C6E3D3">
      <Flex w="70%" direction="column" justify="center" align="stretch" mx={16}>
        <Heading textAlign="center">Unsolved Grid</Heading>
        {!loading ? (
          <Grid templateColumns="repeat(4, 1fr)" gap={6} mt={8}>
            {matrix.map((item, i) => (
              <GridItem
                onClick={() => {
                  setSelectedRow(Math.floor(i / 4));
                }}
                key={`${i}-${item}`}
                w="90%"
                h="72px"
                bg={selectedRow === Math.floor(i / 4) ? '#319795' : '#81E6D9'}
                border="1px solid #2C7A7B"
                boxSizing="border-box"
                boxShadow="0px 2px 0px #2C7A7B"
                borderRadius="8px"
              >
                <Text my={2} fontSize="36px" textAlign="center">
                  {item.toUpperCase()}
                </Text>
              </GridItem>
            ))}
          </Grid>
        ) : (
          <CircularProgress />
        )}
        <Flex mt={8} justify="center" align="center">
          <Button
            disabled={selectedRow === -1}
            minW="150px"
            h="48px"
            p="4px"
            border="1px solid #2C7A7B"
            boxSizing="border-box"
            boxShadow="0px 2px 0px #2C7A7B"
            borderRadius="8px"
            bg="white"
            _hover={{ bg: '#81E6D9' }}
            fontSize="24px"
            onClick={onSubmit}
          >
            Submit
          </Button>
          <IconButton
            ml={4}
            icon={<RepeatIcon />}
            onClick={refresh}
            bg="white"
          />
        </Flex>
      </Flex>
      <Flex w="30%" direction="column" justify="center" align="center">
        <Heading textAlign="center">Word</Heading>
        <Flex
          h="20%"
          w="60%"
          direction="column"
          justify="center"
          align="center"
          m={8}
          border="1px solid #2C7A7B"
          boxSizing="border-box"
          boxShadow="0px 2px 0px #2C7A7B"
          borderRadius="8px"
        >
          <Text textAlign="center" fontSize="36px">
            {word.toUpperCase()}
          </Text>
        </Flex>
        <Button onClick={async () => {
          if (accountData?.address) disconnect();
          else await connectAsync(connectors[0]);
        }}
        >
          {accountData?.address ? 'Disconnect' : 'Connect'}
        </Button>
      </Flex>
    </Flex>
  );
}

export default IndexPage;
