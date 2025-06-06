'use client';

import { JumboTitle } from '../JumboTitle/JumboTitle';
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Container,
  ContainerProps,
  Flex,
  Image,
  Rating,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'motion/react';
import NextImage from 'next/image';
import classes from './index.module.css';

type ImageItem = { src: string; alt: string };

type Hero03Props = ContainerProps & {
  avatarItems?: ImageItem[];
  badge?: string;
  title?: string;
  description?: string;
  rating?: number;
  ratingLabel?: string;
};

export const Hero03 = ({
  badge = 'Build faster with AI-powered tools',
  title = 'Pay Over Time \n Not Upfont',
  description = 'No financials required, Approvals in 24-28 hours. Credit score safe ',
  ...containerProps
}: Hero03Props) => (
  <Container pos="relative" h="100vh" mah={950} style={{ overflow: 'hidden' }} fluid>
    <Container component="section" h="100vh" mah={950} mx="auto" size="xl" {...containerProps}>
      <Box
        pos="absolute"
        top={0}
        left={0}
        h="100%"
        w="100%"
        className={classes['vertical-backdrop']}
      />
      <Flex h="100%" align="center" pos="relative" justify="center">
        <Stack
          pt={{ base: 'xl', sm: 0 }}
          maw="var(--mantine-breakpoint-md)"
          align="center"
          gap="lg"
          style={{ zIndex: 1 }}
        >
          {badge && (
              <Badge
                variant="default"
                p="md"
                bg="var(--mantine-color-body)"
                size="xl"
                mb="lg"
                style={{ textTransform: 'none' }}
              >
                {badge}
              </Badge>
          )}
              <motion.div
      initial={{ opacity: 0.0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >

            <JumboTitle ta="center" order={1} fz="lg" style={{ textWrap: 'balance' }}>
              {title}
            </JumboTitle>
            </motion.div>
            <Text
              ta="center"
              maw="var(--mantine-breakpoint-xs)"
              fz="xl"
              style={{ textWrap: 'balance' }}
            >
              {description}
            </Text>
            <TextInput
              w={400}
              px="md"
              my="lg"
              maw="100vw"
              placeholder="Email address"
              size="xl"
              radius="xl"
              inputMode="email"
              type="email"
              autoComplete="email"
              rightSection={
                <ActionIcon className={classes['cta-icon']} radius="xl" size="lg">
                  <IconArrowRight />
                </ActionIcon>
              }
              classNames={{ input: classes.input }}
            />
        </Stack>
      </Flex>
    </Container>
  </Container>
);