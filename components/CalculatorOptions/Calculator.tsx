'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  IconArrowUp,
  IconCashOff,
  IconCirclePercentageFilled,
  IconClock,
  IconCreditCardPay,
  IconLockOpenOff,
  IconPlus,
  IconRepeat,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Grid,
  Group,
  Radio,
  rem,
  SegmentedControl,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { AgreementWidget } from '@/components/AgreementWidget';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';

const DEFAULT_INTEREST_RATE = 13.95;

const MAX_LOAN_AMOUNT = 500000;
const MIN_LOAN_AMOUNT = 5000;

const calculateCustomRepayment = (loanAmount: number, interestRate: number, months: number) => {
  if (loanAmount <= 0) {
    return 0;
  }
  const annualRate = interestRate / 100;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) {
    return loanAmount / months;
  }
  return (
    loanAmount * ((monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1))
  );
};

const calculateDailyInterest = (loanAmount: number, interestRate: number, days: number) => {
  if (loanAmount <= 0) {
    return 0;
  }
  const dailyRate = interestRate / 100;
  if (dailyRate === 0) {
    return 0;
  }

  return loanAmount * dailyRate * days;
};

const Icon = ({ children }: { children: ReactNode }) => (
  <Card radius="xl" p={4} withBorder>
    <Center>{children}</Center>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useMantineTheme();
  if (active && payload && payload.length) {
    return (
      <Box
        p="sm"
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Text fw="500" c="black">{`${label}`}</Text>
        <Text
          c={theme.colors.secondary[0]}
        >{`Est. Monthly Payment: $${payload[0].value.toLocaleString()}`}</Text>
      </Box>
    );
  }
  return null;
};

type CalculatorProps = {
  startingAmount?: number;
  prefilled?: boolean;
};

export const Calculator = ({ startingAmount = 20000, prefilled = true }: CalculatorProps) => {
  const [baseValue, setBaseValue] = useState(
    startingAmount ? Math.max(Math.min(startingAmount, MAX_LOAN_AMOUNT), MIN_LOAN_AMOUNT) : 10000
  );
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST_RATE);
  const [customTimeframe, setCustomTimeframe] = useState('12');
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const timeframes = [6, 12, 24, 36];
  const HIGHLIGHT_COLOR = '#FFA500';
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);

  type Product = {
    key: string;
    title: string;
    items?: { text: string; icon: ReactNode }[];
    terms?: { length: number; rate: number }[];
    layout?: (product: Product) => ReactNode;
  }

  const products = [
    {
      key: 'Sydney Tools Pay',
      title: 'Sydney Tools Pay',
      items: [
        {
          text: 'Interest free for 30 - 60 days',
          icon: <IconCirclePercentageFilled size={18} />,
        },
      ],
    },
    {
      key: 'FlexPay',
      title: 'FlexPay',
      terms: [
        {
          length: 6,
          rate: DEFAULT_INTEREST_RATE,
        },
        {
          length: 12,
          rate: DEFAULT_INTEREST_RATE,
        },
        {
          length: 24,
          rate: DEFAULT_INTEREST_RATE,
        },
        {
          length: 36,
          rate: DEFAULT_INTEREST_RATE,
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
      layout: (product : Product) => (
        <Grid px="xs" py="xs" align="center" justify="center">
          <Grid.Col span={12} mb={0}>
            <Text c="black" fz="md" ta="center" fw={600}>
              Select a term length
            </Text>
          </Grid.Col>

          {product.terms &&
            product.terms.length > 0 &&
            product.terms.map((term) => {
              const isSelected = selectedTerm === term.length;

              return (
                <Grid.Col span={6} key={term.length} mb="xs">
                  <Button
                    p={2}
                    w="100%"
                    style={{
                      border: `2px solid ${isSelected ? theme.colors.secondary[0] : '#ccc'}`,
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#46e0d6' : '#f8f3f3ff',
                      transition: 'all 0.3s ease',
                      height: '100%',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTerm(term.length);
                      sessionStorage.setItem('customTimeframe', term.length.toString());
                    }}
                    mb="xs"
                  >
                    <Box w="100%" py={0} my={0}>
                      <Text fw={600} c="black" fz="sm" ta="center" my={0}>
                        {term.length} months
                      </Text>
                      <Text c="black" fz="lg" fw="bold" ta="center" mt={4}>
                        $
                        {calculateCustomRepayment(baseValue, term.rate, term.length).toLocaleString(
                          'en-US',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </Text>
                      <Text c="black" fz="xs" ta="center">
                        {isMobile ? 'est.' : 'estimated'} monthly repayment
                      </Text>
                    </Box>
                  </Button>
                </Grid.Col>
              );
            })}
        </Grid>
      ),
    },
    {
      key: 'RevolvePay',
      title: 'RevolvePay',
      items: [
        {
          text: 'Revolving facility',
          icon: <IconRepeat size={18} />,
        },
        {
          text: 'Payout anytime',
          icon: <IconCreditCardPay size={18} />,
        },
      ],
      layout: (product : Product) => (
        <div>
          <Text c="black" fz="md" ta="center" fw="bold">
            Rates starting from 0.03% a day.
          </Text>

          <Flex align="stretch" gap="md">
            <Box
              w="100%"
              py={0}
              my={0}
              mx="sm"
              h="auto"
              style={{
                border: `2px solid ${theme.colors.secondary[0]}`,
                borderRadius: '8px',
                backgroundColor: '#46e0d6',
                transition: 'all 0.3s ease',
              }}
            >
              <Text c="black" fz="lg" fw="bold" ta="center" mt={4}>
                ${baseValue.toLocaleString()}
              </Text>
              <Text fw={600} c="black" fz="sm" ta="center" my={0}>
                Principal
              </Text>
            </Box>{' '}
            <IconPlus size={48} height="auto"/>
            <Box
              w="100%"
              py={0}
              my={0}
              mx="sm"
              h="auto"
              style={{
                border: `2px solid ${theme.colors.secondary[0]}`,
                borderRadius: '8px',
                backgroundColor: '#46e0d6',
                transition: 'all 0.3s ease',
              }}
            >
                <Text fw={600} c="black" fz="sm" ta="center" my={0}>
                </Text>
                <Text c="black" fz="lg" fw="bold" ta="center" mt={4}>
                  $
                  {calculateDailyInterest(baseValue, 0.04, 31).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  / month
                </Text>
                <Text fw={600} c="black" fz="sm" ta="center" my={0}>
                  Until principal is paid off
                </Text>
              </Box>
          </Flex>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!sessionStorage.getItem('loanAmount')) {
      sessionStorage.setItem('loanAmount', startingAmount.toString());
    }
    if (!sessionStorage.getItem('customTimeframe')) {
      sessionStorage.setItem('customTimeframe', '12');
    }
  });

  return (
    <Box
      bg="#F2F5F8"
      px={isMobile ? 'sm' : 'xl'}
      py={isMobile ? 'sm' : 'xl'}
      style={{
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Box
        bg="white"
        style={{
          maxWidth: 1600,
          margin: '0 auto',
          borderRadius: '1rem',
          boxShadow: '0 0 12px rgba(0,0,0,0.05)',
        }}
        py="lg"
      >
        <Grid
          gutter={isMobile ? 'sm' : 'xl'}
          my={0}
          mx="0"
          px="0"
          py="sm"
          style={{
            marginTop: '0px',
            paddingTop: '0px',
            minHeight: '100%',
            height: 'auto',
          }}
          overflow="hidden"
          bg="white"
        >
          {/* Left Column */}
          <Grid.Col
            span={isMobile ? 12 : 4}
            pt={isMobile ? 'xs' : 'md'}
            px={isMobile ? 'xs' : 'md'}
            pb={isMobile ? 'md' : 'xl'}
          >
            <Stack align="center" gap="xs" my={isMobile ? 'md' : 'xl'}>
              <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ width: '100%' }}
              >
                <Grid align="center" gutter="xl">
                  <Grid.Col span={12}>
                    <span>
                      <JumboTitle
                        order={3}
                        fz="xs"
                        ta="center"
                        style={{ textWrap: 'balance' }}
                        c={{ base: 'black', md: 'black' }}
                        fw={600}
                      >
                        Set your
                      </JumboTitle>
                      <JumboTitle
                        order={3}
                        fz="xs"
                        ta="center"
                        style={{ textWrap: 'balance' }}
                        c={{ base: '01E194', md: theme.colors.secondary[0] }}
                        fw={600}
                      >
                        Loan Amount
                      </JumboTitle>
                    </span>
                  </Grid.Col>
                </Grid>
              </motion.div>
            </Stack>

            <Container
              size="lg"
              mt="xl"
              ta="center"
              px={isMobile ? 0 : 'md'}
              pb={isMobile ? 'md' : 'xl'}
            >
              <motion.div
                initial={{ opacity: 0.0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Stack gap={isMobile ? 'sm' : 'md'}>
                  <TextInput
                    type="text"
                    value={baseValue.toLocaleString()}
                    onChange={(event) => {
                      const raw = event.currentTarget.value;
                      const parsed = Number(raw.replace(/,/g, ''));

                      if (!isNaN(parsed)) {
                        const capped = Math.min(parsed, MAX_LOAN_AMOUNT);
                        setBaseValue(capped);
                        sessionStorage.setItem('loanAmount', capped.toString());
                      }
                    }}
                    onKeyDown={(e) => {
                      const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

                      // Allow control keys
                      if (allowed.includes(e.key)) {
                        return;
                      }

                      // Allow one dot if not already present
                      if (e.key === '.') {
                        if (e.currentTarget.value.includes('.')) {
                          e.preventDefault(); // prevent multiple dots
                        }
                        return;
                      }

                      // Allow digits 0–9
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault(); // block everything else
                      }
                    }}
                    onBlur={() => {
                      const raw = baseValue.toString();
                      const parsed = Number(raw.replace(/,/g, ''));
                      if (!isNaN(parsed)) {
                        const capped = Math.max(MIN_LOAN_AMOUNT, parsed);
                        setBaseValue(capped);
                        sessionStorage.setItem('loanAmount', capped.toString());
                      }
                    }}
                    leftSection="$"
                    size="xl"
                    styles={{
                      input: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                      label: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                      section: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                    }}
                    ta="center"
                    rightSection={
                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={() => {
                          setBaseValue(Math.min(startingAmount, MAX_LOAN_AMOUNT));
                          sessionStorage.setItem('loanAmount', startingAmount.toString());
                          console.log('Loan Amount set to:', sessionStorage.getItem('loanAmount'));
                        }}
                      >
                        Reset
                      </Button>
                    }
                    rightSectionWidth={100}
                  />
                  <Stack gap={0}>
                    <Text size="sm" fs="italic">
                      Finance available between $5,000 and $500,000 regardless of outstanding
                      balance
                    </Text>
                    <Slider
                      px="xl"
                      min={MIN_LOAN_AMOUNT}
                      max={MAX_LOAN_AMOUNT}
                      step={1000}
                      value={baseValue}
                      onChange={(value) => {
                        setBaseValue(Math.max(0, value));
                        sessionStorage.setItem('loanAmount', value.toString());
                        console.log('Loan Amount set to:', sessionStorage.getItem('loanAmount'));
                      }}
                      c={theme.colors.secondary[0]}
                      size="xl"
                      styles={{ markLabel: { color: 'orange' } }}
                    />
                  </Stack>
                </Stack>
              </motion.div>
            </Container>
          </Grid.Col>

          {/* Right Column */}
          <Grid.Col span={isMobile ? 12 : 5} px={0}>
            <Stack gap="xs">
              <JumboTitle
                order={1}
                fz="xs"
                ta="center"
                style={{ textWrap: 'balance' }}
                c="black"
                fw={600}
              >
                Compare and Select Payment Options
              </JumboTitle>

              {products.map((product) => {
                const isSelected = selectedProduct === product.key;
                return (
                  <Card
                    key={product.key}
                    onClick={() => {
                      setSelectedProduct(product.key);
                      setSelectedTerm(null);
                      sessionStorage.setItem('notes', product.key);
                    }}
                    style={{}}
                  >
                    <Card
                      key={product.key}
                      style={{
                        border: `1px solid ${isSelected ? HIGHLIGHT_COLOR : theme.colors.secondary[0]}`,
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#FFF3E0' : '#f8f9fa',
                        boxShadow: '0px 3px 2px rgba(0,0,0,0.6)',
                      }}
                      pb={4}
                      pt={0}
                      px={0}
                      mx="lg"
                    >
                      <Group bg={theme.colors.secondary[0]} px="md" py="xs">
                        <Radio value={product.key} checked={isSelected} readOnly/>
                        <Text
                          fw={600}
                          c={isSelected ? 'black' : 'black'}
                          fz="lg"
                          ta="center"
                          bg={theme.colors.secondary[0]}
                          py="md"
                        >
                          {product.title}
                        </Text>
                      </Group>
                      <Group mt="xs" grow align="center" justify="center" wrap="nowrap">
                        {product.items &&
                          product.items.map((item) => (
                            <Group key={item.text} gap="xs" align="center" justify="center" px="xs">
                              <Icon>{item.icon}</Icon>
                              <Text
                                c={isSelected ? HIGHLIGHT_COLOR : 'black'}
                                fz="sm"
                                ta="center"
                                fw={600}
                              >
                                {item.text}
                              </Text>
                            </Group>
                          ))}
                      </Group>
                      {isSelected && product.layout?.(product)}
                    </Card>
                  </Card>
                );
              })}
            </Stack>
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 3} pt={isMobile ? 'xl' : 'md'} px="xl" pb="xl">
            <AgreementWidget
              showDataShareCheckbox={false}
              disableButton={
                !(
                  selectedProduct &&
                  (products.find((p) => p.key === selectedProduct)?.terms ? selectedTerm : true)
                )
              }
            />
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};
