import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { createClient, Provider } from "wagmi";
import { InjectedConnector } from "@wagmi/core";

const client = createClient({
  autoConnect: true,
  connectors() {
    return [new InjectedConnector()];
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
