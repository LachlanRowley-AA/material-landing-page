import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../../theme';


import { Providers } from '../providers';

export default function AdminLayout({ children }: {children: any}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MantineProvider theme={theme}>{children}</MantineProvider>          
        </Providers>
      </body>
    </html>
  );
}
