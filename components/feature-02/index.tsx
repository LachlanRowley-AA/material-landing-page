'use client';

import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { Box, Card, Container, Flex, Grid, Stack, Text } from '@mantine/core';
import {
  IconCurrencyDollar,
  IconFileOff,
  IconCalendarTime,
  IconBuilding,
  IconClockBolt,
  IconBuildingBank,
  IconTrendingUp,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';
import classes from './index.module.css';

type Feature = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
};

const FEATURES: Feature[] = [
  {
    icon: <IconCurrencyDollar size={28} stroke={1.5} />,
    title: 'Finance up to $300k',
    description: 'Access unsecured funding of up to $300,000 to fuel your business growth.',
  },
  {
    icon: <IconFileOff size={28} stroke={1.5} />,
    title: 'No Financials Needed',
    description: 'Get approved without tax returns or financial statements.',
  },
  {
    icon: <IconCalendarTime size={28} stroke={1.5} />,
    title: 'Flexible Terms',
    description: '5-year loan terms with the option for early payoff.',
  },
  {
    icon: <IconBuilding size={28} stroke={1.5} />,
    title: 'Use for Materials',
    description: 'Works with all building material purchases — no restrictions.',
  },
  {
    icon: <IconClockBolt size={28} stroke={1.5} />,
    title: 'Fast & Simple',
    description: 'Fully online application with 2–3 day turnaround.',
  },
  {
    icon: <IconBuildingBank size={28} stroke={1.5} />,
    title: 'Supplier Paid Directly',
    description: 'Funds go straight to your supplier, helping build trust and credit.',
  },
  {
    icon: <IconTrendingUp size={28} stroke={1.5} />,
    title: 'Scale Confidently',
    description: 'Take on bigger projects without large upfront costs.',
  },
] as const;

const FeatureCell = ({
  icon,
  title,
  description,
  index = 1,
  iconSize,
}: Feature & {
  index?: number;
  iconSize?: number;
}) => (
  <motion.div
    initial={{ opacity: 0.0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 * index, ease: 'easeInOut' }}
    viewport={{ once: true }}
    style={{ height: '100%' }}
  >
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: 'var(--mantine-shadow-xl)' }}
      transition={{ type: 'spring' }}
      style={{
        borderRadius: 'var(--mantine-radius-lg)',
        height: '100%',
      }}
    >
      <Card radius="lg" p="xl" className={classes.cell} h="100%">
        <Stack gap="xs">
          <Flex w={iconSize} h={iconSize} justify="center" align="center">
            {icon}
          </Flex>
          <Box>
            <Text fz="xl">{title}</Text>
            <Text fz="md" c="dimmed">
              {description}
            </Text>
          </Box>
        </Stack>
      </Card>
    </motion.div>
  </motion.div>
);

type Feature02Props = {
  title?: string;
  features?: Feature[];
  iconSize?: number;
};

export const Feature02 = ({
  title = 'Features',
  features = FEATURES,
  iconSize = 20,
}: Feature02Props) => (
  <Container
    bg="var(--mantine-color-body)"
    py={{
      base: 'calc(var(--mantine-spacing-lg) * 4)',
      xs: 'calc(var(--mantine-spacing-lg) * 5)',
      lg: 'calc(var(--mantine-spacing-lg) * 6)',
    }}
    fluid
  >
    <Container size="lg" px={0}>
      <JumboTitle order={2} fz="md" style={{ textWrap: 'balance' }}>
        {title}
      </JumboTitle>
    </Container>
    <Container size="lg" p={0} mt="xl">
      <Grid gutter="xl">
        {features.map((feature, index) => (
          <Grid.Col key={feature.title} span={{ base: 12, xs: 6, md: 4 }} mih="100%">
            <FeatureCell
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              iconSize={iconSize}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  </Container>
);