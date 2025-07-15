'use client';

import { JumboTitle } from '../JumboTitle/JumboTitle';
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  BackgroundImage,
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
  Title,
  Button,
  useMantineTheme 
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
  title = 'More Material Less Red Tape',
  description = 'No financials required, Approvals in 24-48 hours. Credit score safe ',
  ...containerProps
}: Hero03Props) => {
  const theme = useMantineTheme();
  return (
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
                src="/logo_transparent.png"
                mb={0}
                style={{ textTransform: 'none' }}
                maw={300}
                mt="xl"
              />
          )}
          <Image src="/subheading.png" pt={0} mt={0} pb="xl" w={450}/>
          <motion.div
            initial={{ opacity: 0.0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            viewport={{ once: true }}
          >
            <Title fz={80} ta="center">
              More Material
                <BackgroundImage src="./tape.png">
                  <Text span inherit px="100px"> Less Red Tape</Text>
                </BackgroundImage>
            </Title>
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
              bg="rgba(1, 1, 1, 0.8)"
              mt="xl"
              c="#01E194"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#01E194';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(1, 1, 1, 0.8)';
                e.currentTarget.style.color = '#01E194';
              }}
              onClick={(e:any)=>{e.preventDefault;scrollToSection('footer')}}>
              Get Started
            </Button>
        </Stack>
      </Flex>
    </Container>
  </Container>
)};