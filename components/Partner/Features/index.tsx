'use client';
import { Box, Card, Container, Flex, Grid, Stack, Text, useMantineTheme } from '@mantine/core';
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
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';


type Feature = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
};


const FEATURES: Feature[] = [
  {
    icon: <IconCurrencyDollar size={28} stroke={1.5} />,
    title: 'No Merchant Fee',
    description: 'Don\'t pay to give your customers options. Completely free for you',
  },
  {
    icon: <IconFileOff size={28} stroke={1.5} />,
    title: 'Increase Sales, Get Paid Sooner',
    description: 'Stop price objections with flexible term options that are paid straight to you, the supplier',
  },
  {
    icon: <IconCalendarTime size={28} stroke={1.5} />,
    title: 'No Change to Your Accounts Process',
    description: 'Simply put your custom qr code on your invoices, and we\'ll handle the rest',
  },
  {
    icon: <IconBuilding size={28} stroke={1.5} />,
    title: 'Minimal Merchant Requirements',
    description: `As long as you sell high ticket products, you are eligible to partner with us`,
  },
  {
    icon: <IconClockBolt size={28} stroke={1.5} />,
    title: 'Help Clients Buy More with No Extra Risk to You',
    description: '',
  },
  {
    icon: <IconTrendingUp size={28} stroke={1.5} />,
    title: 'Fast Customer Application',
    description: '4 click application process',
  },
] as const;


const FeatureCell = ({
  icon,
  title,
  description,
  index = 1,
}: Feature & {
  index?: number;
  
}) => {
  const theme = useMantineTheme();
  return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 * index, ease: 'easeOut' }}
    viewport={{ once: true }}
    style={{ height: '100%' }}
  >
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{ height: '100%' }}
      viewport={{ once: true }}
    >
      <Card
        radius="lg"
        p="xl"
        h="100%"
        style={{
          backgroundColor: 'white',
          border: '1px solid #ebebeb',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(1, 225, 148, 0.15)';
          e.currentTarget.style.borderColor = '#01E194';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
          e.currentTarget.style.borderColor = '#ebebeb';
        }}
      >
        <Stack gap="md">
          <Flex
            w={56}
            h={56}
            justify="center"
            align="center"
            bg={theme.colors.tertiary[0]}
            style={{
              borderRadius: '12px',
              color: '#01E194',
            }}
          >
            {icon}
          </Flex>
          
          <Box>
            <Text size="lg" fw={600} mb="xs" c="#000">
              {title}
            </Text>
            <Text size="sm" c="#666" lh={1.5}>
              {description}
            </Text>
          </Box>
        </Stack>
      </Card>
    </motion.div>
  </motion.div>
)};

type Feature02Props = {
  title?: string;
  features?: Feature[];
};

export const Feature02 = ({
  title = 'Features',
  features = FEATURES,
}: Feature02Props) => {
  const theme = useMantineTheme();
  return(
  <Container
    py={{ base: 60, xs: 80, lg: 100 }}
    fluid
    bg={theme.colors.tertiary[0]}
  >
    <Container size="lg" px={0}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <JumboTitle order={2} fz="md" c="black" ta='center'>
          {title}
        </JumboTitle>
      </motion.div>
    </Container>
    
    <Container size="xl" p={0} mt="xl">
      {/* Mobile: Stack all cards */}
      <Box hiddenFrom="md">
        <Grid gutter="xl">
          {features.map((feature, index) => (
            <Grid.Col key={feature.title} span={12}>
              <FeatureCell
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      {/* Desktop: 2-3-2 layout with offsets */}
      <Box visibleFrom="md">
        {/* First row: 2 cards with offset */}
        <Grid gutter="xl" mb="xl">
          {features.map((feature, index) => (
            <Grid.Col key={feature.title} span={4}>
              <FeatureCell
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
                />
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    </Container>
  </Container>
)};
export default Feature02;