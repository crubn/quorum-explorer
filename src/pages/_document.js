import { ColorModeScript, useToast } from "@chakra-ui/react";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";

export default class Document extends NextDocument {

  render() {
   
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/explorer/images/favicon.png" />
          <meta property="og:title" content="Quorum Explorer | Trential" />
          <meta property="og:description" content="Explore the Quorum blockchain in real time" />
          <meta property="og:image" content="/explorer/images/og-image.png" />
        </Head>
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
