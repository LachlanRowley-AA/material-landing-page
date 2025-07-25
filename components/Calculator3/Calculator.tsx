'use client';

import { AnimatedCounter, AnimatedCounterProps } from './AnimatedCounter';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { Box, BoxProps, Button, Container, Grid, Stack, Text, rem, TextInput, Slider, Group, useMantineTheme, Switch, SegmentedControl } from '@mantine/core';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AgreementWidget } from '@/components/AgreementWidget';

const DEFAULT_INTEREST_RATE = 13.95;
const DAYS_IN_YEAR = 365;
const WEEKS_IN_YEAR = 52;
const MONTHS_IN_YEAR = 12;
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 365 / 12;
const LOAN_TERM_YEARS = 3;

const MAX_LOAN_AMOUNT = 500000;
const MIN_LOAN_AMOUNT = 5000;

const calculateRepayment = (loanAmount: number, interestRate: number, isWeekly: boolean) => {
  if (loanAmount <= 0) return 0;

  const annualRate = interestRate / 100;
  const totalPayments = isWeekly ? LOAN_TERM_YEARS * WEEKS_IN_YEAR : LOAN_TERM_YEARS * MONTHS_IN_YEAR;
  const dailyRate = annualRate / DAYS_IN_YEAR;
  const daysBetweenPayments = isWeekly ? DAYS_IN_WEEK : DAYS_IN_MONTH;
  const effectivePeriodRate = (1 + dailyRate) ** daysBetweenPayments - 1;

  return loanAmount * ((effectivePeriodRate * (1 + effectivePeriodRate) ** totalPayments) /
    ((1 + effectivePeriodRate) ** totalPayments - 1));
};

const calculateCustomRepayment = (loanAmount: number, interestRate: number, months: number) => {
  if (loanAmount <= 0) return 0;
  const annualRate = interestRate / 100;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return loanAmount / months;
  return loanAmount * ((monthlyRate * (1 + monthlyRate) ** months) /
    ((1 + monthlyRate) ** months - 1));
};

const StatCell = ({
  startValue, endValue, title, description, ...boxProps
}: BoxProps & { startValue: AnimatedCounterProps['startValue']; endValue: AnimatedCounterProps['endValue']; title: string; description: string }) => {
  const theme = useMantineTheme();
  return(
  <motion.div initial={{ opacity: 0.0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeInOut' }}>
    <Box {...boxProps}>
      <AnimatedCounter
        ta="center"
        fz={rem(50)}
        fw="bold"
        c={{ base: theme.colors.secondary[0], md: theme.colors.secondary[0] }}
        endValue={Math.max(0, endValue)}
        prefix="$"
        startValue={Math.max(0, startValue)}
      />
      <Text fz="lg" inline ta="center" c={{ base: theme.colors.secondary[0], md: "black" }}>
        {description}
      </Text>   
    </Box>
  </motion.div>
)};

const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useMantineTheme();
  if (active && payload && payload.length) {
    return (
      <Box p="sm" style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Text fw="500" c="black">{`${label} months`}</Text>
        <Text c={theme.colors.secondary[0]}>{`Monthly Payment: $${payload[0].value.toLocaleString()}`}</Text>
      </Box>
    );
  }
  return null;
};

type CalculatorProps = {
  startingAmount?: number;
  prefilled?: boolean
}


export const Calculator = ({ startingAmount = 20000, prefilled = true }: CalculatorProps) => {
  const [baseValue, setBaseValue] = useState(startingAmount);
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST_RATE);
  const [isWeekly, setIsWeekly] = useState(false);
  const [customTimeframe, setCustomTimeframe] = useState('12');
  const [showGraph, setShowGraph] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const repayment = calculateRepayment(baseValue, interestRate, isWeekly);
  const customRepayment = calculateCustomRepayment(baseValue, interestRate, parseInt(customTimeframe));

  const timeframes = [6, 12, 24, 36];

  useEffect(() => {
    sessionStorage.setItem('loanAmount', MIN_LOAN_AMOUNT.toString());
    sessionStorage.setItem('customTimeframe', '12');
  })


  const chartData = timeframes.map(months => {

    const monthlyPayment = months === 6 ? calculateCustomRepayment(baseValue, 20.0, months) : calculateCustomRepayment(baseValue, interestRate, months);
    const totalInterest = (monthlyPayment * months) - baseValue;
    const isSelected = months === parseInt(customTimeframe);
    return {
      months,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(Math.max(0, totalInterest)),
      label: `${months} months`,
      color: isSelected ? '#FFA500' : theme.colors.secondary[0]
    };
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
      >
        <Grid
          gutter={isMobile ? 'sm' : 'xl'}
          my={0}
          mx="0"
          px="0"
          style={{
            marginTop: '0px',
            paddingTop: '0px',
            minHeight: '100%',
            height: 'auto'
          }}
          overflow='hidden'
          bg="white"
        >
          {/* Left Column */}
          <Grid.Col span={isMobile ? 12 : 4} pt={isMobile ? 'xs' : 'md'} px={isMobile ? 'xs' : 'md'} pb={isMobile ? 'md' : 'xl'}>
            <Stack align="center" gap="xs" my={isMobile ? 'md' : 'xl'}>
              <motion.div initial={{ opacity: 0.0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }} style={{ width: '100%' }}>
                <Grid align="center" gutter="xl">
                  <Grid.Col span={12}>
                    <JumboTitle order={1} fz="xs" ta="center" style={{ textWrap: 'balance' }} c="black" fw={600}>
                      Set your loan amount
                    </JumboTitle>
                  </Grid.Col>
                </Grid>
              </motion.div>
            </Stack>

            <Container size="lg" mt="xl" ta="center" px={isMobile ? 0 : 'md'} pb={isMobile ? 'md' : 'xl'}>
              <motion.div initial={{ opacity: 0.0, y: 0 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Stack gap={isMobile ? 'sm' : 'md'}>
                  <TextInput
                    label="Loan Amount"
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
                      if (allowed.includes(e.key)) return;

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
                    size='xl'
                    styles={{
                      input: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                      label: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                      section: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' }
                    }}
                    ta="center"
                    rightSection={
                      <Button size="xs" variant="subtle" onClick={() => {
                          setBaseValue(Math.min(startingAmount, MAX_LOAN_AMOUNT));
                          sessionStorage.setItem('loanAmount', startingAmount.toString());
                          console.log('Loan Amount set to:', sessionStorage.getItem('loanAmount'));

                        }
                      }>Reset</Button>
                    }
                    rightSectionWidth={100}
                  />
                  <Stack gap={0}>
                    <Text size="sm" fs="italic">Finance available up to $500,000 regardless of outstanding balance</Text>
                    <Slider
                      px="xl"
                      label="Loan Amount"
                      min={MIN_LOAN_AMOUNT}
                      max={MAX_LOAN_AMOUNT}
                      step={1000}
                      value={baseValue}
                      onChange={(value) => {
                          setBaseValue(Math.max(0, value))
                          sessionStorage.setItem('loanAmount', value.toString());
                          console.log('Loan Amount set to:', sessionStorage.getItem('loanAmount'));
                        }
                      }
                      c={theme.colors.secondary[0]}
                      size="xl"
                      styles={{ markLabel: { color: "orange" } }}
                    />
                  </Stack>
                </Stack>
              </motion.div>
            </Container>
          </Grid.Col>

          {/* Right Column */}
          <Grid.Col span={isMobile ? 12 : 5} pt={isMobile ? 'xl' : 'md'} px={isMobile ? 'xs' : 'md'} pb={isMobile ? 'md' : 'xl'}>
            <Stack align="center" gap="x" my={isMobile ? 'md' : 'xl'}>
              <motion.div initial={{ opacity: 0.0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }} style={{ width: '100%' }}>
                <JumboTitle order={1} fz="xs" ta="center" style={{ textWrap: 'balance' }} c="black" fw={600}>
                  Compare Payment Options
                </JumboTitle>
                <Text pt="md" ta="center" fs="italic">All plans may be paid out at any time without paying any remaining interest</Text>
              </motion.div>
            </Stack>

            <Container size="lg" mt="md" ta="center" pt={isMobile ? 0 : 'md'} px={isMobile ? 0 : 'md'} pb={isMobile ? 'md' : 'xl'}>
              <motion.div initial={{ opacity: 0.0, y: 0 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Stack gap={isMobile ? 'md' : 'xs'}>
                  {showGraph ? (
                    <Box style={{ height: '400px' }}>
                      <SegmentedControl
                        value={customTimeframe}
                        data={timeframes.map(m => ({ label: `${m} months`, value: `${m}` }))}
                        onChange={(value) => {
                          setCustomTimeframe(value);
                          sessionStorage.setItem('customTimeframe', value);
                        }}
                        size="md"
                        styles={{
                          root: { backgroundColor: '#f8f9fa' },
                          control: {
                            '&[dataActive]': {
                              backgroundColor: theme.colors.secondary[0],
                              color: 'white'
                            }
                          }
                        }}
                      />
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={(v) => `${v.toLocaleString()}`} fontSize={12} />
                          <YAxis dataKey="label" type="category" fontSize={12} width={100} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="monthlyPayment" name="Monthly Payment" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box h={400} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Grid gutter="md" w="100%">
                        {chartData.map((item, index) => (
                          <Grid.Col span={12} key={index}>
                            <Button
                              fullWidth
                              p="sm"
                              style={{
                                border: `1px solid ${item.color}`,
                                borderRadius: '8px',
                                backgroundColor: item.color === '#FFA500' ? '#FFF3E0' : '#f8f9fa',
                                height: '95%',
                              }}
                              onClick={() => {
                                setCustomTimeframe(String(item.months))
                                sessionStorage.setItem('customTimeframe', String(item.months));
                                }
                              }
                            >
                              <Box w="100%">
                                <Text fw="600" c="black" fz="sm" ta="center">{item.months} months</Text>
                                <Text c={item.color} fz="lg" fw="bold" ta="center">${item.monthlyPayment.toLocaleString()}</Text>
                                <Text c="dimmed" fz="xs" ta="center">monthly payment</Text>
                              </Box>
                            </Button>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Box>
                  )}
                  <Group justify='flex-end' w="100%" visibleFrom="md">
                    <Switch onChange={(e) => setShowGraph(e.currentTarget.checked)} checked={showGraph} />
                    <Text>Toggle graph display</Text>
                  </Group>
                </Stack>
              </motion.div>
            </Container>
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 3}>
            <Container px="xl">
              <AgreementWidget showDataShareCheckbox={prefilled} />
            </Container>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};
