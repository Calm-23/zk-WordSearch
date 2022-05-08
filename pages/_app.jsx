import { ChakraProvider } from '@chakra-ui/react';
import { createClient, Provider } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import React from 'react';
import theme from '../theme';

const client = createClient({
  autoConnect: true,
  connectors() {
    return [new InjectedConnector()];
  },
});

// eslint-disable-next-line react/prop-types
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
