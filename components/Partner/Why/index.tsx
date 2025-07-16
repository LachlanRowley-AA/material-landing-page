'use client';

import {
  Box,
  Container,
  Text,
  Image,
  Grid,
  useMantineTheme,
  Stack,
  Flex,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';

const reasons = [
  {
    title: 'Empower Your Customers with Flexible Finance',
    description: `Offer your customers access to flexible financing for building materials—allowing them to take on larger projects without upfront strain. This opens the door to more frequent and higher-value purchases, increasing loyalty and trust in your business.`,
  },
  {
    title: 'Increase Sales While Getting Paid Upfront',
    description: `With our broker-backed finance solution, your customers pay over time, but you get paid in full right away. This eliminates the cash flow issues associated with offering in-house terms while still giving your customers the breathing room they need to commit to bigger orders.`,
  },
  {
    title: 'Simple Setup, No Risk, No Fuss',
    description: `You don’t need to worry about paperwork or approval processes—our finance broker handles everything. There's no impact on your operations, no cost to implement, and no risk to you. Start offering finance immediately without changing how you run your business.`,
  },
];

export const Why = () => {
  const sectionHeight = '500px';
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width:1024px)`);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <Box bg="white" pb="xl">
      <Box
        w="100%"
        h="100%"
        mah={sectionHeight}
        pos="relative"
        style={{ overflow: 'hidden' }}
      >
        <Box
          pos="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(3, 3, 3, 0.6)"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <JumboTitle ta="center" fz="md" fw="bold" c="#01E194" mt="xl" mb="xl">
            Partner with a Finance Broker to Grow Your Sales
          </JumboTitle>
        </Box>
      </Box>

      <Container size="sm" />

      <Grid mx="xl" align="center">
        <Grid.Col span={{ base: 6 }} visibleFrom="md">
          <Flex h={sectionHeight} align="center" justify="center">
            <Image mah={sectionHeight} src="./truck.jpg" />
          </Flex>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }} mt="xl">
          <Stack >
            {reasons.map((item, index) => (
              <Box
                key={index}
                p="md"
                bg="#F4F5FA"
                style={{ borderRadius: '8px' }}
              >
                <Flex align="center" gap="sm">
                  <ThemeIcon color="teal" variant="light" size="lg" radius="xl">
                    <IconChevronRight size="1.5rem" />
                  </ThemeIcon>
                  <Title order={4}>{item.title}</Title>
                </Flex>
                <Text mt="sm" c="dimmed" fz="md">
                  {item.description}
                </Text>
              </Box>
            ))}
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default Why;
