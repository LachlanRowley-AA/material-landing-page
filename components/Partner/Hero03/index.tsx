'use client';

import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import {
  Box,
  Container,
  ContainerProps,
  Flex,
  Image,
  Stack,
  Text,
  Title,
  Button,
  Overlay,
  useMantineTheme
} from '@mantine/core';
import { motion } from 'motion/react';
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
  title = 'Transform Your Business',
  description = '',
  ...containerProps
}: Hero03Props) => {
  const theme = useMantineTheme();
  return(
  <Container pos="relative" h={{base: "90vh", md: "80vh"}} mah={950} style={{ overflow: 'hidden' }} fluid >
    <Container component="section" h="100%" mx="auto" size="xl" {...containerProps}>
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
          <source src="/background_video.webm" type="video/webm" />
        </video>
      </Box>
      <Box
        pos="absolute"
        top={0}
        left={0}
        h="100%"
        w="100%"
      />
      <Flex h="100%" pos="relative" justify="center" align="center">
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
                p={30}
                src="/logo.svg"
                mb={0}
                style={{ textTransform: 'none' }}
                maw={500}
                mt="xl"
                pt="xl"
              />
          )}
          <Image src="/subheading_white.png" pt={-10} mt={-20} pb="xl" w={300}/>
          <motion.div
            initial={{ opacity: 0.0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            viewport={{ once: true }}
          >
            <Title ta="center" fz={{base: 60, md:80} }
              style={{ textWrap: 'balance'}}
              c="white">
                {title}
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
              bg={theme.colors.secondary[9]}
              mt="xl"
              c="white"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.secondary[0];
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.secondary[9];
                e.currentTarget.style.color = "white";
              }}
              onClick={(e:any)=>{e.preventDefault;scrollToSection('footer')}}>
              Get Started
            </Button>
        </Stack>
      </Flex>
    </Container>
  </Container>
)};
export default Hero03