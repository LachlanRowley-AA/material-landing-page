'use client';

import { ReactNode, useContext, useEffect } from 'react';
import {
  IconCashOff,
  IconCircleCheck,
  IconCirclePercentageFilled,
  IconClock,
  IconCreditCardPay,
  IconRepeat,
} from '@tabler/icons-react';
import {
  Accordion,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { CalculatorContext } from './CalculatorContext';


export default function CalculatorModal() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const ctx = useContext(CalculatorContext);
  const { baseValue, defaultInterestRate } = ctx;

  type Product = {
    minimumAmount?: number;
    key: string;
    title: string;
    items?: { text: string; icon: ReactNode }[];
    terms?: { length: number; rate: number }[];
    layout?: (product: Product) => ReactNode;
    logo?: string;
    keySell?: () => ReactNode;
  };

  const products = [
    {
      minimumAmount: 10000,
      key: 'FlexPay',
      title: 'FlexPay',
      terms: [
        {
          length: 6,
          rate: defaultInterestRate,
        },
        {
          length: 12,
          rate: defaultInterestRate,
        },
        {
          length: 24,
          rate: defaultInterestRate,
        },
        {
          length: 36,
          rate: defaultInterestRate,
        },
      ],
      items: [
        {
          text: 'Longer term lengths',
          icon: <IconClock size={18} />,
        },
        {
          text: 'No penalty interest for early payout',
          icon: <IconCashOff size={18} />,
        },
      ],
      moreInfo: {
        desc: 'Longer term lengths to minimise the impact to cashflow',
        reasons: ['You need to make a large one-off payment'],
        interest: 'Interest starting from 11.45% p.a',
      },
      keySell: () => (
        <div>
          <Title order={3} fw='normal' ta='center'>
            Pay back in 6, 12, 24 or 36 months
          </Title>
        </div>
      ),
    },
    {
      minimumAmount: 0,
      logo: '/Sydney Tools/sydney_tools.svg',
      key: 'Sydney Tools Pay',
      title: 'Sydney Tools Pay',
      items: [
        {
          text: 'Interest free for 30 - 60 days',
          icon: <IconCirclePercentageFilled size={18} />,
        },
      ],
      moreInfo: {
        desc: 'Buy now and get between 30 & 60 days interest free',
        reasons: ['You have worked queued up', 'You are waiting for invoices to be paid'],
      },
      keySell: () => (
        <div>
          <Group justify='center'>
            <Title order={3} fw='normal' ta='center'>
              30-60 Days Interest Free
            </Title>
          </Group>
        </div>
      ),
    },
    {
      minimumAmount: 10000,
      key: 'RevolvePay',
      title: 'RevolvePay',
      items: [
        {
          text: 'Revolving line of credit for up to the next 2 years',
          icon: <IconRepeat size={18} />,
        },
        {
          text: 'Payout anytime',
          icon: <IconCreditCardPay size={18} />,
        },
      ],
      moreInfo: {
        desc: 'Set up a revolving line of credit',
        reasons: [
          'You need a payment extension for your account',
          'You need to make frequent purchases',
        ],
        interest: 'Interest starting from 0.03% per day',
      },
      keySell: () => (
        <div>
          <Title fw='normal' order={3} ta='center'>
            Line of credit for up to 2 years
          </Title>
        </div>
      ),
    },
  ];

  const moreInfo = (
    <div>
      <Group justify="center" py="md">
        <JumboTitle
          order={3}
          fz="xs"
          ta="center"
          style={{ textWrap: 'balance' }}
          c={{ base: 'black', md: 'black' }}
          fw={600}
        >
          Select your{' '}
        </JumboTitle>
        <JumboTitle
          order={3}
          fz="xs"
          ta="center"
          style={{ textWrap: 'balance' }}
          c={{ base: '01E194', md: theme.colors.secondary[0] }}
          fw={600}
        >
          Product
        </JumboTitle>
      </Group>

      <Grid w="100%">
        {products.map((product) => (
          <Grid.Col span={{ base: 12, md: 4 }} key={product.key} style={{ minWidth: 0 }}>
            <Card
              shadow="0 3px 8px rgba(0,0,0,0.2)"
              withBorder
              mx={{ base: 'xs', md: 'lg' }}
              px={{ base: 'xl', md: 'xl' }}
              h="100%"
              radius="lg"
              bg={product.minimumAmount < baseValue ? 'white' : '#f3f3f3'}
            >
              <Text fw={600} mb="md" ta="center" style={{fontSize: 36}} c='#1fcfc3' pb={0}>
                {product.title}
              </Text>
              <Accordion
                multiple
                defaultValue={isMobile ? [] : ['reasons']}
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
                py="xs"
              >
                {product.keySell?.()}
                {/* <Accordion.Item key='product' value={product.moreInfo?.reason || ''} /> */}
                {/* <Accordion.Item key="reasons" value="reasons" mb={-2} w="100%">
                  <Accordion.Control>Ideal when</Accordion.Control>
                  <Accordion.Panel>
                    {product.moreInfo.reasons.map((reason) => (
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
                        </Text>
                      </Group>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item> */}
                <Accordion.Item key="features" value="features" mt={0} bd="0px">
                  <Accordion.Control>Features</Accordion.Control>
                  <Accordion.Panel>
                    {product.items.map((item) => (
                      <Group align="flex-start" key={item.text} mb="xs">
                        <IconCircleCheck color="#01E194" />
                        <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                          {item.text}
                        </Text>
                      </Group>
                    ))}
                    {product.moreInfo.interest && (
                      <Group key={product.moreInfo.interest}>
                        <IconCircleCheck color="#01E194" />
                        <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                          {product.moreInfo.interest}
                        </Text>
                      </Group>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              <Text fw={600}>
                Minimum financed amount: ${product.minimumAmount.toLocaleString()}
              </Text>
              <Flex align="flex-end" justify="center">
                <Button
                  bg="#1fcfc3"
                  mt="xl"
                  onClick={() => {
                    sessionStorage.setItem('notes', product.key);
                    close();
                  }}
                  disabled={product.minimumAmount > baseValue}
                >
                  Select
                </Button>
              </Flex>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );

  useEffect(() => {
    if (!sessionStorage.getItem('loanAmount')) {
      sessionStorage.setItem('loanAmount', ctx.startingAmount.toString());
    }
    if (!sessionStorage.getItem('customTimeframe')) {
      sessionStorage.setItem('customTimeframe', '12');
    }
  });

  return <div>{moreInfo}</div>;
}
