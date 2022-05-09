import {
  Grid,
  GridItem,
  Button,
  Heading,
  Flex,
  Text,
  IconButton,
  CircularProgress,
  Tooltip,
  useToast,
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
import {testnetAddress, mainnetAddress} from '../utils/address.ts';
import abi from '../utils/abi.json';
import { getCalldata } from '../utils/zk';

function IndexPage() {
  const [matrix, setMatrix] = React.useState([]);
  const [word, setWord] = React.useState('');
  const [selectedRow, setSelectedRow] = React.useState(-1);

  const [loading, setLoading] = React.useState(true);
  const [checking, setChecking] = React.useState(false);

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
    addressOrName: mainnetAddress,
    contractInterface: abi,
    signerOrProvider: signerData,
  });

  const toast = useToast();

  const refresh = () => {
    setSelectedRow(-1);
    generateWord();
  };

  const onSubmit = async () => {
    if (!accountData) {
      return;
    }
    console.log(contract);
    setChecking(true);
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

    const calldata = await getCalldata(
      ogGrid,
      selectedGrid,
      subGrid,
      selectedWord,
      wordMatrix,
    );
    if (calldata) {
      const result = await contract.verifyProof(
        calldata[0],
        calldata[1],
        calldata[2],
        calldata[3],
      );

      if (result) {
        toast({
          title: 'Wohooooo!',
          description: "Great job! You've found the word!",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Wrong selection!',
          description: "The words don't match. Please try again!",
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Wrong selection!',
        description: "The words don't match. Please try again!",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setChecking(false);
    refresh();
  };

  React.useEffect(() => {
    console.log('Selected row:', selectedRow);
  }, [selectedRow]);

  const getTooltipText = () => {
    if (!accountData?.address) return 'Connect to your wallet to play the game!';
    if (selectedRow === -1) return 'Select a row!';
    if (checking) return 'Evaluating your selection!';
    return '';
  };

  return (
    <Flex w="100%" h="100vh" bg="#FBD38D">
      <Flex w="70%" direction="column" justify="center" align="stretch" mx={16}>
        <Heading textAlign="center" color="#244b57">
          Unsolved Grid
        </Heading>
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
                bg={selectedRow === Math.floor(i / 4) ? '#db8276' : '#e4afa0'}
                // border="1px solid #2C7A7B"
                boxSizing="border-box"
                boxShadow="0px 2px 0px #7B341E"
                borderRadius="8px"
              >
                <Text my={2} fontSize="36px" textAlign="center" color="#FFFAF0">
                  {item.toUpperCase()}
                </Text>
              </GridItem>
            ))}
          </Grid>
        ) : (
          <CircularProgress />
        )}
        <Flex mt={8} justify="center" align="center">
          <Tooltip label={getTooltipText()} aria-label="A tooltip" shouldWrapChildren>
            <Button
              disabled={selectedRow === -1 || !accountData || checking}
              minW="150px"
              h="48px"
              p="4px"
              border="1px solid #2C7A7B"
              boxSizing="border-box"
              boxShadow="0px 2px 0px #2C7A7B"
              bg="#aacac2"
              _hover={{ bg: '#678e92' }}
              color="#065666"
              borderRadius="8px"
              fontSize="24px"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Tooltip>
          <IconButton
            ml={4}
            icon={<RepeatIcon />}
            onClick={refresh}
            bg="white"
          />
        </Flex>
      </Flex>
      <Flex w="30%" direction="column" justify="center" align="center">
        <Heading textAlign="center" color="#244b57">
          Word
        </Heading>
        <Flex
          h="20%"
          w="60%"
          direction="column"
          justify="center"
          align="center"
          m={8}
          bg="#afcec4"
          boxSizing="border-box"
          boxShadow="0px 2px 0px #2C7A7B"
          borderRadius="8px"
        >
          <Text textAlign="center" fontSize="36px" color="#F0FFF4">
            {word.toUpperCase()}
          </Text>
        </Flex>
        <Button
          border="1px solid #2C7A7B"
          boxSizing="border-box"
          boxShadow="0px 2px 0px #2C7A7B"
          bg="#aacac2"
          _hover={{ bg: '#678e92' }}
          color="#065666"
          borderRadius="8px"
          onClick={async () => {
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
