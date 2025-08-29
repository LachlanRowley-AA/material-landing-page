'use client';

import { useEffect, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconCheck, IconCircleCheck, IconLockOpen2 } from '@tabler/icons-react';
import {
  Accordion,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const cards = [
  { id: 1, title: 'FlexPay', text: 'This is the first card' },
  { id: 2, title: 'RevolvePay', text: 'This is the second card' },
  { id: 3, title: 'Card Three', text: 'This is the third card' },
];

type Product = {
  minimumAmount: number;
  key: string;
  title: string;
  logo?: string;
  desc: string;
  reasons: string[];
  interest: string;
};

const products: Product[] = [
  {
    minimumAmount: 0,
    logo: '/Sydney Tools/sydney_tools.svg',
    key: 'Sydney Tools Pay',
    title: 'Sydney Tools Pay',
    desc: 'Buy now and get between 30 & 60 days interest free',
    reasons: ['You have worked queued up', 'You are waiting for invoices to be paid'],
    interest: '',
  },
  {
    minimumAmount: 10000,
    key: 'FlexPay',
    title: 'FlexPay',
    desc: 'Enjoy longer term lengths to minimise the impact to your cashflow',
    reasons: ['You need to make a large one-off payment'],
    interest: 'Interest starting from 11.45% p.a',
  },
  {
    minimumAmount: 10000,
    key: 'RevolvePay',
    title: 'RevolvePay',
    desc: 'Set up a revolving line of credit',
    reasons: [
      'You need a payment extension for your account',
      'You need to make frequent purchases',
    ],
    interest: 'Interest starting from 0.03% per day',
  },
];

export default function Products() {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = useMantineTheme();

  const next = () => setActiveIndex((prev) => (prev + 1) % cards.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const moreInfo = (
    <Container size="auto" bg={theme.colors.gray[0]}>
      <Grid w="100%">
        {products.map((product) => (
          <Grid.Col span={{ base: 12, md: 4 }} key={product.key} style={{ minWidth: 0 }}>
            <Card
              shadow="0 3px 8px rgba(0,0,0,0.2)"
              withBorder
              mx={{ base: 'xs', md: 'lg' }}
              px={{ base: 'xs', md: 'xl' }}
              h="100%"
              radius="lg"
            >
              <Text fw={700} mb="md" fz="xl" ta="center">
                {product.title}
              </Text>
              {product.desc && <Text mb="sm">{product.desc}</Text>}
              <Accordion
                multiple
                defaultValue={isMobile ? [] : ['features', 'reasons']}
                styles={{
                  label: {
                    fontWeight: 700,
                  },
                  control: {
                    borderTop: '1px solid black',
                    borderBottom: '1px solid black',
                  },
                  root: {
                    height: '100%',
                  },
                }}
              >
                {/* <Accordion.Item key='product' value={product.moreInfo?.reason || ''} /> */}
                <Accordion.Item key="reasons" value="reasons" mb={-2} w="100%">
                  <Accordion.Control>Ideal when</Accordion.Control>
                  <Accordion.Panel>
                    {product.reasons.map((reason) => (
                      <Group align="flex-start" key={reason}>
                        <IconCheck color="#01E194" />
                        <Text
                          style={{
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                            flex: 1,
                            maxWidth: '100%', // keeps inside the card
                          }}
                        >
                          {reason}
                        </Text>{' '}
                      </Group>
                    ))}
                    <div style={{ marginBottom: '40px' }} />
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key="features" value="features" mt={0} bd="0px">
                  <Accordion.Control>Features</Accordion.Control>
                  <Accordion.Panel>
                    <Group align="flex-start" mb="xs">
                      <IconLockOpen2 color="#01E194" />
                      <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                        Unsecured
                      </Text>
                    </Group>
                    {product.interest && (
                      <Group key={product.interest}>
                        <IconCircleCheck color="#01E194" />
                        <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                          {product.interest}
                        </Text>
                      </Group>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              <Text fw={600}>
                Minimum financed amount: ${product.minimumAmount.toLocaleString()}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );

  useEffect(() => {
    const interval = setInterval(() => next(), 10000);
    return () => clearInterval(interval);
  }, []);

  // Card dimensions
  const ACTIVE_WIDTH = 280;
  const ACTIVE_HEIGHT = 220;
  const INACTIVE_WIDTH = 200;
  const INACTIVE_HEIGHT = 160;

  // Dynamic wrapper height: tallest card
  const WRAPPER_HEIGHT = Math.max(ACTIVE_HEIGHT, INACTIVE_HEIGHT);

  return (
    <Box bg={theme.colors.gray[0]} py="md">
      <Container>
        <Stack align="center" gap="md">
          {/* Dynamic-height wrapper */}
          <div
            style={{
              height: WRAPPER_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Group justify="center" gap="lg">
              {cards.map((card, index) => {
                const isActive = index === activeIndex;
                const width = isActive ? ACTIVE_WIDTH : INACTIVE_WIDTH;
                const height = isActive ? ACTIVE_HEIGHT : INACTIVE_HEIGHT;

                return (
                  <Card
                    key={card.id}
                    shadow="sm"
                    padding="lg"
                    style={{
                      width,
                      height,
                      transition: 'all 0.3s ease',
                      opacity: isActive ? 1 : 0.6,
                      zIndex: isActive ? 2 : 1,
                    }}
                  >
                    <Text fw={700}>{card.title}</Text>
                    <Text size="sm" c="dimmed">
                      {card.text}
                    </Text>
                  </Card>
                );
              })}
            </Group>
          </div>
          {/* Navigation buttons */}
          <Group gap="sm">
            <Button variant="light" onClick={prev}>
              <IconChevronLeft />
            </Button>
            <Button variant="light" onClick={next}>
              <IconChevronRight />
            </Button>
          </Group>

          {/* Dots indicator */}
          <Group justify="center" gap="xs">
            {cards.map((_, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`Go to card ${index + 1}`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: index === activeIndex ? '#228be6' : '#ccc',
                  transition: 'background 0.3s ease',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveIndex(index);
                  }
                }}
              />
            ))}
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
