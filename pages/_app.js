import { ChakraProvider } from "@chakra-ui/react";
import { Provider, createClient } from "wagmi";

const client = createClient();

function MyApp({ Component, pageProps }) {
  return (
    <Provider client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
