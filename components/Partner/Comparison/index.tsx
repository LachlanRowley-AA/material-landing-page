'use client';

import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import {
  Badge,
  Box,
  Button,
  Card,
  CardProps,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  SegmentedControl,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconBook2,
  IconBuilding,
  IconBuildingCastle,
  IconDeviceAnalytics,
  IconFileText,
  IconFingerprint,
  IconPalette,
  IconPhone,
  IconSchool,
  IconTrendingUp,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import NextLink from 'next/link';
import { ReactNode, useState } from 'react';
import classes from './index.module.css';

const Icon = ({ children }: { children: ReactNode }) => (
  <Card radius="xl" p="sm" withBorder>
    <Center>{children}</Center>
  </Card>
);

const PricingCard = ({
  badge,
  cta,
  description,
  icon,
  items,
  title,
  shadow,
}: {
  badge?: ReactNode;
  cta: ReactNode;
  description: string;
  icon: ReactNode;
  items: Array<{
    description: string;
    icon: ReactNode;
    title: string;
  }>;
  shadow?: CardProps['shadow'];
  strikethroughPrice?: string;
  showStrikethroughPrice?: boolean;
  title: string;
}) => (
  <Card
    radius="lg"
    shadow={shadow}
    miw={{ base: '100%', sm: 350 }}
    maw={500}
    withBorder
    className={classes.root}
  >
    <Group justify="space-between" align="start" mb="md">
      <Box>{icon}</Box>
      <Box>{badge}</Box>
    </Group>
    <Text fz="xl" fw="bold">
      {title}
    </Text>
    <Text mb="md" c="dimmed" inline style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
      {description}
    </Text>
    <Card.Section my="lg">
      <Divider />
    </Card.Section>
    <Stack>
      {items.map((item) => (
        <Group key={item.title} gap="xs" align="flex-start" wrap="nowrap">
        <Box mt={2}>{item.icon}</Box>
        <Stack gap={0} style={{ flex: 1 }}>
            {item.title && <Text fw={500}>{item.title}</Text>}
            <Text c="dimmed" fz="sm" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {item.description}
            </Text>
        </Stack>
        </Group> 
     ))}
    </Stack>
    <Card.Section my="lg">
      <Divider />
    </Card.Section>
    <Box>{cta}</Box>
  </Card>
);

export const Pricing01 = () => {
  return (
    <Container
      bg="var(--mantine-color-body)"
      py={{
        base: 'calc(var(--mantine-spacing-lg) * 1)',
        xs: 'calc(var(--mantine-spacing-lg) * 2)',
        lg: 'calc(var(--mantine-spacing-lg) * 3)',
      }}
      fluid
    >
      <Container size="md">
        <Stack align="center" gap="xs">
          <JumboTitle order={2} fz="md" ta="center" style={{ textWrap: 'balance' }}>
            How does it work
          </JumboTitle>
          <Text c="dimmed" ta="center" fz="xl" style={{ textWrap: 'balance' }}>
            Choose between one of two implementation methods
          </Text>
        </Stack>
      </Container>
      <Group
        mt={{
          base: 'calc(var(--mantine-spacing-lg) * 2)',
          lg: 'calc(var(--mantine-spacing-lg) * 3)',
        }}
        justify="center"
        gap="xl"
      >
        <PricingCard
          title="Low Touch"
          description="Fastest implementation"
          cta={
            <Button component={NextLink} href="#" size="lg" variant="light" fullWidth>
              Get started
            </Button>
          }
          icon={
            <Icon>
              <IconPalette size={21} />
            </Icon>
          }
          items={[
            {
              title: 'Custom Content',
              description: 'Get a custom QR Code to a cobranded landing page to track customer origin',
              icon: (
                <Icon>
                  <IconFileText size={21} />
                </Icon>
              ),
            },
            {
              title: 'Easy Setup',
              description: 'Just register and start including your custom QR code on invoices.',
              icon: (
                <Icon>
                  <IconUsers size={21} />
                </Icon>
              ),
            },
            {
              title: 'Fast',
              description: 'Ready to go within 24 hours',
              icon: (
                <Icon>
                  <IconDeviceAnalytics size={21} />
                </Icon>
              ),
            },
          ]}
        />
        <PricingCard
          shadow="lg"
          badge={
            <Badge variant="light" size="lg">
              Recommended
            </Badge>
          }
          title="Integrated Implementation"
          description="For improved customer experience"
          cta={
            <Button className={classes.cta} component={NextLink} href="#" size="lg" fullWidth>
              Get started
            </Button>
          }
          icon={
            <Icon>
              <IconSchool size={21} />
            </Icon>
          }
          items={[
            {
              title: 'Personalised Content',
              description: 'Cobranded landing page and customer-unique QR codes',
              icon: (
                <Icon>
                  <IconBook2 size={21} />
                </Icon>
              ),
            },
            {
              title: 'Integrated Setup',
              description: 'Integration with your database for syncing customer details and displaying on their page.',
              icon: (
                <Icon>
                  <IconUsersGroup size={21} />
                </Icon>
              ),
            },
            {
              title: 'Speed',
              description: 'Ready to go within days',
              icon: (
                <Icon>
                  <IconTrendingUp size={21} />
                </Icon>
              ),
            },
            {
                title: 'Secure',
                description: '128-bit identification so no-one sees the wrong customer\'s information',
                icon: (
                    <Icon>
                        <IconTrendingUp size={21} />
                    </Icon>
                )
            }
          ]}
        />
      </Group>
    </Container>
  );
};

export default Pricing01