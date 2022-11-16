import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../../styles/globals.css";
import Layout from "../common/components/Misc/Layout";

function MyApp({ Component, pageProps, router }: AppProps) {
  const breakpoints = createBreakpoints({
    sm: "320px",
    md: "850px",
    lg: "960px",
    xl: "1200px",
    "2xl": "1536px",
  });
  const theme = extendTheme({
    breakpoints,
    colors: {
      brand: {
        500: '#0170E0',
      }
    }
  });

  return (
    <SessionProvider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      session={pageProps.session}
      refetchInterval={10}
      refetchOnWindowFocus={true}
    >
      <ChakraProvider theme={theme}>
        <title>Quorum Explorer</title>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
