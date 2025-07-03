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
  Button,
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

const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    else {
      console.log('section not found');
    }
  };


export const Hero03 = ({
  badge = ' ',
  title = 'Pay Over Time \n Not Upfont',
  description = 'No financials required, Approvals in 24-48 hours. Credit score safe ',
  ...containerProps
}: Hero03Props) => (
  <Container pos="relative" h="80vh" mah={950} style={{ overflow: 'hidden' }} fluid>
    <Container component="section" h="80vh" mah={950} mx="auto" size="xl" {...containerProps}>
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
                maw={{base: "80vw", md: "60vw"}}
                mt="xl"
              />
          )}
          <Image src="/subheading.png" pt={0} mt={0} pb="xl" w={450} maw={{base: "80vw", md: "60vw"}}/>
          <motion.div
            initial={{ opacity: 0.0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            viewport={{ once: true }}
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
            <Button
              size="lg"
              bg="rgba(1, 225, 148, 0.2)"
              mt="xl"
              c="#01E194"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#01E194';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(1, 225, 148, 0.2)';
                e.currentTarget.style.color = '#01E194';
              }}
              onClick={(e:any)=>{e.preventDefault;scrollToSection('footer')}}>
              Get Started
            </Button>
        </Stack>
      </Flex>
    </Container>
  </Container>
);