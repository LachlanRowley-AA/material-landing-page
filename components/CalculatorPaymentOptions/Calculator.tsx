'use client';

import { ReactNode, useState } from 'react';
import {
  IconArrowUp,
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
import { motion } from 'motion/react';
import {
  Box,
  Button,
  Card,
  CardProps,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  rem,
  Slider,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import classes from './index.module.css';

const DEFAULT_INTEREST_RATE = 13.95; // 13.95% annual interest

const MAX_LOAN_AMOUNT = 500000; // Maximum loan amount
const MIN_LOAN_AMOUNT = 5000; // Minimum loan amount

const calculateCustomRepayment = (startingAmount: number, interestRate: number, months: number) => {
  const loanAmount = startingAmount;
  if (!loanAmount) {
    return 0;
  }

  const annualRate = interestRate / 100;
  const monthlyRate = annualRate / 12;

  if (monthlyRate === 0) {
    return loanAmount / months;
  }

  return (
    (loanAmount * ((monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1)))
  );
};

const Icon = ({ children }: { children: ReactNode }) => (
  <Card radius="xl" p="sm" withBorder>
    <Center>{children}</Center>
  </Card>
);

type CalculatorProps = {
  startingAmount?: number;
};
export const Calculator = ({ startingAmount = 20000 }: CalculatorProps) => {
  const startingBalance = startingAmount || 0;
  const [baseValue, setBaseValue] = useState(
    startingAmount ? Math.max(Math.min(startingAmount, MAX_LOAN_AMOUNT), MIN_LOAN_AMOUNT) : 10000
  );

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const HIGHLIGHT_COLOR = '#FFA500';

  const products = [
    {
      key: 'PromoPay',
      title: 'Sydney Tools Pay',
      sub: 'Interest ',
      terms: [
        {
          length: 3,
          rate: 10,
        },
        {
          length: 5,
          rate: 10,
        },
        {
          length: 7,
          rate: 10,
        },
      ],
    },
    {
      key: 'FlexPay',
      title: 'FlexPay',
      sub: 'No security over your tools',
      terms: [
        {
          length: 3,
          rate: 10,
        },
        {
          length: 5,
          rate: 10,
        },
      ],
    },
    {
      key: 'RevolvePay',
      title: 'RevolvePay',
      sub: 'A revolving facility',
      terms: [
        {
          length: 3,
          rate: 10,
        },
        {
          length: 5,
          rate: 10,
        },
      ],
    },
  ];

  return (
    <Grid gutter={isMobile ? 'sm' : 'xl'} my={0} mx={0} px="xl" bg="white">
      {/* Column 1 - Loan amount slider */}
      <Grid.Col span={isMobile ? 12 : 3}>
        <Stack align="center" gap="xs" my={isMobile ? 'md' : 'xl'}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <Text ta="center" fw={600} fz="lg">
              Set your{' '}
              <Text span c={theme.colors.secondary[0]}>
                Loan Amount
              </Text>
            </Text>
          </motion.div>
        </Stack>

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
              if (allowed.includes(e.key)) {
                return;
              }
              if (e.key === '.' && e.currentTarget.value.includes('.')) {
                e.preventDefault();
              }
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
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
            }}
            ta="center"
            rightSection={
              <Button
                size="xs"
                variant="subtle"
                onClick={() => {
                  setBaseValue(Math.min(startingAmount, MAX_LOAN_AMOUNT));
                  sessionStorage.setItem('loanAmount', startingAmount.toString());
                }}
              >
                Reset
              </Button>
            }
            rightSectionWidth={100}
          />

          <Text size="sm" fs="italic">
            Finance available between $5,000 and $500,000 regardless of outstanding balance
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
            }}
            mx={isMobile ? 'xs' : 0}
            // marks={
            //   startingBalance > 0
            //     ? [
            //         {
            //           value: startingBalance,
            //           label: (
            //             <div>
            //               <p style={{ margin: 0 }}>Your balance</p>
            //               <p style={{ margin: 0 }}>with DBM</p>
            //             </div>
            //           ),
            //         },
            //       ]
            //     : []
            // }
            size="xl"
            styles={{ markLabel: { color: 'orange' } }}
          />
        </Stack>
      </Grid.Col>

      {/* Column 2 - Product selection */}
      <Grid.Col span={isMobile ? 12 : 9}>
        <Stack gap="md">
          {products.map((product) => {
            const isSelected = selectedProduct === product.key;
            return (
              <Card
                key={product.key}
                style={{
                  border: `1px solid ${isSelected ? HIGHLIGHT_COLOR : theme.colors.secondary[0]}`,
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#FFF3E0' : '#f8f9fa'
                }}
              >
                <Button
                  key={product.key}
                  fullWidth
                  p="sm"
                  style={{
                    backgroundColor: 'transparent',
                    height: '100%',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => {
                    setSelectedProduct(product.key);
                    setSelectedTerm(null);
                  }}
                >
                  <Box w="100%">
                    <Text fw={600} c={isSelected ? HIGHLIGHT_COLOR : 'black'} fz="sm" ta="center">
                      {product.title}
                    </Text>
                    <Text
                      c={isSelected ? HIGHLIGHT_COLOR : 'dimmed'}
                      fz="lg"
                      fw="bold"
                      ta="center"
                      mt={4}
                    >
                      {product.sub}
                    </Text>
                  </Box>
                </Button>
                {isSelected && (
                  <Group px="md" py="xs">
                    {product.terms.map((term) => {
                      const isSelected = selectedTerm === term.length;
                      return (
                        <div style={{ width: '100%' }}>
                          <Button
                            key={term.length}
                            p="sm"
                            w="100%"
                            style={{
                              border: `2px solid ${isSelected ? HIGHLIGHT_COLOR : '#ccc'}`,
                              borderRadius: '8px',
                              backgroundColor: isSelected ? 'lightgreen' : 'white',
                              height: '16.6%',
                              transition: 'all 0.3s ease',
                            }}
                            onClick={() => setSelectedTerm(term.length)}
                            mb="xs"
                          >
                            <Box w="100%">
                              <Text
                                fw={600}
                                c={isSelected ? HIGHLIGHT_COLOR : 'black'}
                                fz="sm"
                                ta="center"
                              >
                                {term.length} years
                              </Text>
                            </Box>
                          </Button>
                          {isSelected && (
                            <Flex justify="center">
                              <Button
                                mx="sm"
                                p="sm"
                                justify="center"
                                disabled
                                w="85%"
                                style={{
                                  border: `2px solid ${HIGHLIGHT_COLOR}`,
                                  borderRadius: '8px',
                                  backgroundColor: 'lightgreen',
                                  height: '33%',
                                  cursor: 'default',
                                }}
                              >
                                <Box w="100%">
                                  <Text fw={600} c="green" fz="sm" ta="center">
                                    Repayment
                                  </Text>
                                  <Text c="black" fz="lg" fw="bold" ta="center" mt={4}>
                                    ${calculateCustomRepayment(baseValue, term.rate, term.length * 12).toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </Text>
                                  <Text c="dimmed" fz="xs" ta="center">
                                    estimated monthly payment
                                  </Text>
                                </Box>
                              </Button>
                            </Flex>
                          )}
                        </div>
                      );
                    })}
                  </Group>
                )}
              </Card>
            );
          })}
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
