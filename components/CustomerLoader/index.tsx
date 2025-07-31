import { forwardRef } from 'react';
import cx from 'clsx';
import { Box, MantineLoaderComponent, Image, Center } from '@mantine/core';
import classes from './CssLoader.module.css';

export const CssLoader: MantineLoaderComponent = forwardRef(
  ({ className, ...others }, ref) => (
    <Center style={{ flexDirection: 'column'}} pt="-20vh" mt="-20vh">
      <Image src="/logo.svg" maw="70vw"/>
      <Box
        component="span"
        className={cx(classes.loaderWrapper, className)}
        ref={ref}
        {...others}
      >
        <span className={classes.progressBar} />
      </Box>
    </Center>
  )
);
