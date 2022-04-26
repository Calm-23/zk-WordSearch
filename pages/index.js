import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React from "react";
import { addCalldata, multiplyCalldata } from "../utils/zk";
import addresses from "../utils/address.json";
import abi from "../utils/abi.json";
import {
  useAccount,
  useConnect,
  useContract,
  useProvider,
  useSigner,
  useNetwork,
  useDisconnect,
} from "wagmi";
var randomWords = require('random-words');

function Home() {
  const {
    connect,
    connectors,
    error: connectError,
    isConnecting,
    pendingConnector,
  } = useConnect();
  const { data: accountData, isError, isLoading } = useAccount();
  const { data: networkData, error: networkError, loading } = useNetwork();
  const { disconnect } = useDisconnect();

  // const [loadingVerifyBtn, setLoadingVerifyBtn] = useState(false);
  // const [loadingVerifyAndMintBtn, setLoadingVerifyAndMintBtn] = useState(false);
  // const [loadingStartGameBtn, setLoadingStartGameBtn] = useState(false);

  const {
    data: signerData,
    isError: isSignerError,
    isLoading: isSignerLoading,
  } = useSigner();

  const provider = useProvider();

  const contract = useContract({
    addressOrName: addresses.address,
    contractInterface: abi,
    signerOrProvider: signerData || provider,
  });

  const contractNoSigner = useContract({
    addressOrName: addresses.address,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  const DEFAULT_OG =
    [[122, 107, 117, 109],
    [63, 111, 64, 65],
    [120, 114, 116, 98],
    [106, 115, 112, 102]];
  const [ogGrid, setOgGrid] = React.useState(DEFAULT_OG);

  const DEFAULT = [[false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false]];
  const [selected, setSelected] = React.useState(DEFAULT);


  const generate = async () => {
    console.log('Contract: ', addresses);
    let randomWord;
    do {
      randomWord = randomWords({ exactly: 1, maxLength: 4 });
      if (randomWord[0].length === 4) break;
    } while (true);
    console.log('Word:', randomWord);
    var answer = [];
    for (let i = 0; i < 4; i++) {
      answer[i] = randomWord[0].charCodeAt(i);
    }
    console.log('ASCII:', answer);
    let max = 122;
    let min = 97;

    let selectedRow = Math.floor(Math.random() % 4);
    console.log("Selected Row :", selectedRow);
    var grid = new Array(4).fill(0).map(() => new Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let random = Math.floor(Math.random() * (max - min)) + min;
        if (i == selectedRow)
          grid[i][j] = answer[j];
        else
          grid[i][j] = random;
      }
    }
    console.log("Grid:", grid);
  };

  return (
    <Button onClick={generate}>Generate</Button>
  );
}

export default Home;
