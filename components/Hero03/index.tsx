'use client';

import { useEffect, useState } from 'react';
import { IconArrowRight, IconCircleCheckFilled } from '@tabler/icons-react';
import { motion } from 'motion/react';
import {
  BackgroundImage,
  Box,
  Button,
  Container,
  ContainerProps,
  Flex,
  Image,
  Overlay,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import classes from './index.module.css';

type ImageItem = { src: string; alt: string };

type Hero03Props = ContainerProps & {
  avatarItems?: ImageItem[];
  badge?: string;
  title?: string;
  description?: string[];
  rating?: number;
  ratingLabel?: string;
  partner?: string;
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
  description = ['No financials required', 'Approvals in 24-48 hours', 'Credit score safe'],
  partner,
  ...containerProps
}: Hero03Props) => {
  const theme = useMantineTheme();
  const [isPageReady, setIsPageReady] = useState<boolean>(false);
  const [hasLogo, setHasLogo] = useState<boolean>(false);
  const [textColour, setTextColor] = useState<string>('white');

  useEffect(() => {
    const preloadHeroData = async () => {
      if (!partner) {
        setIsPageReady(true);
        return;
      }
      try {
        const logo = await fetch(`/${partner}/logo_black.png`, { method: 'HEAD' });
        const contentLength = logo.headers.get('content-length');
        const isValid = !!(logo.ok && contentLength && parseInt(contentLength, 10) > 0);
        setHasLogo(isValid);
        if(isValid) {
          setTextColor('black');
          console.log('valid');
        }
      } catch (error) {
        console.log('error');
      }
    };
    preloadHeroData();
  }, [partner]);

  return (
    <Container
      pos="relative"
      h={{ base: '100vh', md: '85vh' }}
      mah={950}
      fluid
      style={{
        overflow: 'hidden',
        bg: 'white'
      }}
    >
      <Container component="section" h="100%" mx="auto" size="xl" {...containerProps}>
        <Box
          pos="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          style={{ zIndex: 0, overflow: 'hidden' }}
          bg="white"
        >
          {!hasLogo && <Overlay color="#000" backgroundOpacity={0.65} />}
          {!hasLogo && (
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
          )}{' '}
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
          <Stack maw="var(--mantine-breakpoint-md)" align="center" gap="md" style={{ zIndex: 1 }}>
            {badge && (
              <Image
                variant="default"
                p="md"
                src={hasLogo ? `/${partner}/logo_black.png` : '/logo.svg'}
                mb={0}
                style={{ textTransform: 'none' }}
                maw={{ base: '70vw', md: '30vw' }}
                w={{ base: '70wv' }}
              />
            )}
            <Image src={hasLogo ? "/subheading.png" : "/subheading_white.png"} pt={-10} mt={-20} pb="xl" w={300} />
            <motion.div
              initial={{ opacity: 0.0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <Title fz={{ base: 40, md: 80 }} ta="center" c={textColour}>
                More Material
                <BackgroundImage src="./tape.png">
                  <Text
                    span
                    inherit
                    px={{ base: '20px', md: '100px' }}
                    ta="center"
                    style={{ textWrap: 'balance' }}
                    c="white"
                  >
                    Less Red Tape
                  </Text>
                </BackgroundImage>
              </Title>
            </motion.div>

            <Stack gap="xs" align="start">
              {description.map((item, index) => (
                <Flex key={index} align="center" gap={10}>
                  <IconCircleCheckFilled size={20} color={theme.colors.green[6]} />
                  <Text c={textColour} fz="lg">
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
                scrollToSection('contact');
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
