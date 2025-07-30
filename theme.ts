'use client';

import { createTheme, colorsTuple, Loader } from '@mantine/core';
import { CssLoader } from './components/CustomerLoader';


export const theme = createTheme({
  colors: {
    primary: colorsTuple('#10578b'),
    secondary: ['#1fcfc3','#149a91','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3AA'],
    tertiary: colorsTuple('#f6f6f6')
  },
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, custom: CssLoader},
        type: 'custom',
      }
    })
  }
});
