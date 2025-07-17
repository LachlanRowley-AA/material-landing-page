'use client';

import { createTheme, colorsTuple } from '@mantine/core';

export const theme = createTheme({
  colors: {
    primary: colorsTuple('#10578b'),
    secondary: ['#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3','#1fcfc3AA'],
    tertiary: colorsTuple('#f6f6f6')
  }
});
