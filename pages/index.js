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
import { useProvider, useContract } from 'wagmi';

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

  const provider = useProvider();

  const addContract = useContract({
    addressOrName: addresses.addContract,
    contractInterface: addVerifierABI,
    signerOrProvider: signerData || provider,
  });

  const onSubmit = async () => {
    const ogMatrix = Array(4);
    for (let i = 0; i < 4; i++) ogMatrix[i] = Array(4);

    const subMatrix = Array(4);
    for (let i = 0; i < 4; i++) subMatrix[i] = Array(4).fill(0);

    for (let i = 0; i < 16; i++) ogMatrix[Math.floor(i / 4)][i % 4] = matrix[i].charCodeAt(0) - 32;
    for (let i = 0; i < 4; i++) subMatrix[selectedRow][i] = 1;

    const wordMatrix = Array(4);
    for (let i = 0; i < 4; i++) wordMatrix[i] = word[i].charCodeAt(0) - 32;

    console.log(ogMatrix);
    console.log(subMatrix);
    console.log(wordMatrix);
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
                key={i}
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
      </Flex>
    </Flex>
  );
}

export default IndexPage;
