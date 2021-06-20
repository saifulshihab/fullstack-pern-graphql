import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { Provider as UrqlProvider, createClient } from 'urql';

const client = createClient({ url: 'http://localhost:4000/graphql', fetchOptions: {credentials: 'include'} });

import theme from '../theme';

function MyApp({ Component, pageProps }: any) {
  return (
    <UrqlProvider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </UrqlProvider>
  );
}

export default MyApp;
