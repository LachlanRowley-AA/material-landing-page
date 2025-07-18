'use client';

import { JumboTitle } from '../JumboTitle/JumboTitle';
import {
  BackgroundImage,
  Box,
  Button,
  Container,
  ContainerProps,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
  Overlay, 
  Image
} from '@mantine/core';
import { IconArrowRight, IconCircleCheckFilled } from '@tabler/icons-react';
import { motion } from 'motion/react';
import classes from './index.module.css';

type ImageItem = { src: string; alt: string };

type Hero03Props = ContainerProps & {
  avatarItems?: ImageItem[];
  badge?: string;
  title?: string;
  description?: string[];
  rating?: number;
  ratingLabel?: string;
};

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.log('section not found');
  }
};

export const Hero03 = ({
  badge = ' ',
  title = 'More Material Less Red Tape',
  description = [
    'No financials required',
    'Approvals in 24-48 hours',
    'Credit score safe',
  ],
  ...containerProps
}: Hero03Props) => {
  const theme = useMantineTheme();

  return (
    <Container
      pos="relative"
      h={{base: "100vh", md:"85vh"}}
      mah={950}
      fluid
      style={{
        overflow: 'hidden',
        background: `linear-gradient(45deg, ${theme.colors.primary[0]} 0%, ${theme.colors.secondary[0]} 75%)`,
      }}
    >
      <Container
        component="section"
        h="100%"
        mx="auto"
        size="xl"
        {...containerProps}
      >
              <Box
                pos="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                style={{ zIndex: 0, overflow: 'hidden' }}
              >
                <Overlay color="#000" backgroundOpacity={0.65}/>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                >
                  <source src="/construction.webm" type="video/webm" />
                </video>
              </Box>
        <Box
          pos="absolute"
          top={0}
          left={0}
          h="100%"
          w="100%"
          className={classes['vertical-backdrop']}
        />
        <Flex
          h="100%"
          pos="relative"
          justify="center"
          align="center" // vertically center
        >
          <Stack
            maw="var(--mantine-breakpoint-md)"
            align="center"
            gap="md"
            style={{ zIndex: 1 }}
          >
          {badge && (
              <Image
                variant="default"
                p="md"
                src="/logo.svg"
                mb={0}
                style={{ textTransform: 'none' }}
                maw={{base: "70vw", md: "30vw"}}
                w={{base: "70wv"}}
              />
          )}
          <Image src="/subheading_white.png" pt={-10} mt={-20} pb="xl" w={300}/>
            <motion.div
              initial={{ opacity: 0.0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <Title fz={{ base: 40, md: 80 }} ta="center" c="white">
                More Material
                <BackgroundImage src="./tape.png">
                  <Text
                    span
                    inherit
                    px={{ base: '20px', md: '100px' }}
                    ta="center"
                    style={{ textWrap: 'balance' }}
                  >
                    Less Red Tape
                  </Text>
                </BackgroundImage>
              </Title>
            </motion.div>

            <Stack gap="xs" align="start">
              {description.map((item, index) => (
                <Flex key={index} align="center" gap={10}>
                  <IconCircleCheckFilled
                    size={20}
                    color={theme.colors.green[6]}
                  />
                  <Text c="white" fz="lg">
                    {item}
                  </Text>
                </Flex>
              ))}
            </Stack>

            <Button
              size="lg"
              bg="rgba(1, 1, 1, 0.8)"
              mt="md"
              c={theme.colors.secondary[0]}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.secondary[0];
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(1, 1, 1, 0.8)';
                e.currentTarget.style.color = theme.colors.secondary[0];
              }}
              onClick={(e: any) => {
                e.preventDefault();
                scrollToSection('footer');
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Container>
  );
};
