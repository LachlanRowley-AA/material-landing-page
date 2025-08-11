import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { GoogleAnalytics} from '@next/third-parties/google'



export const metadata = {
  title: 'Eazytrade powered by Asset Alley',
  description: 'Eazytrade powered by Asset Alley landing page!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <GoogleAnalytics gaId="G-3LCY44MH0B" />
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
