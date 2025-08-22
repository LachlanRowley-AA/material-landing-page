'use client';

import { JumboTitle } from '../JumboTitle/JumboTitle';
import {
  Box,
  Container,
  ContainerProps,
  Flex,
  Image,
  Stack,
} from '@mantine/core';
import { motion } from 'motion/react';
import classes from './index.module.css';

type ImageItem = { src: string; alt: string };

type Hero02Props = ContainerProps & {
  avatarItems?: ImageItem[];
  badge?: string;
  title?: string;
  description?: string;
  rating?: number;
  ratingLabel?: string;
};

export const Hero02 = ({
  badge = ' ',
  title = 'Pay Over Time \n Not Upfont',
  ...containerProps
}: Hero02Props) => (
  <Container pos="relative" h="15vh" style={{ overflow: 'hidden' }} fluid>
    <Container component="section" h="15vh" mx="auto" size="xl" {...containerProps}>
      <Box
        pos="absolute"
        top={0}
        left={0}
        h="100%"
        w="100%"
        className={classes['vertical-backdrop']}
      />
      <Flex h="100%" pos="relative" justify="center">
        <Stack
          pt={{ base: 'xl', sm: 0 }}
          maw="var(--mantine-breakpoint-md)"
          align="center"
          gap="sm"
          style={{ zIndex: 1 }}
        >
          {badge && (
              <Image
                variant="default"
                p="xs"
                bg="var(--mantine-color-body)"
                src="/dbm.png"
                mb={0}
                style={{ textTransform: 'none' }}
                maw={600}
                mt="xl"
              />
          )}
          <Image src="/subheading.png" pt={0} mt={0} w={300}/>
        </Stack>
      </Flex>
    </Container>
  </Container>
);