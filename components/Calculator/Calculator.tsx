'use client';

import { AnimatedCounter, AnimatedCounterProps } from './AnimatedCounter';
import { JumboTitle } from '../JumboTitle/JumboTitle';
import { Box, BoxProps, Container, Grid, Stack, Text, rem, TextInput, Slider, Group, useMantineTheme, Switch } from '@mantine/core';
import { motion } from 'motion/react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { useMediaQuery } from '@mantine/hooks';


const DEFAULT_INTEREST_RATE = 15.95; // 15.95% annual interest
const DAYS_IN_YEAR = 365;
const WEEKS_IN_YEAR = 52;
const MONTHS_IN_YEAR = 12;
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 365 / 12; // Average days per month
const LOAN_TERM_YEARS = 5;


const calculateRepayment = (loanAmount: number, interestRate: number, isWeekly: boolean) => {
  if (loanAmount <= 0) {return 0};

  const annualRate = interestRate / 100;
  const totalPayments = isWeekly ? LOAN_TERM_YEARS * WEEKS_IN_YEAR : LOAN_TERM_YEARS * MONTHS_IN_YEAR;
  const dailyRate = annualRate / DAYS_IN_YEAR;
  const daysBetweenPayments = isWeekly ? DAYS_IN_WEEK : DAYS_IN_MONTH;

  // Effective period rate with daily compounding
  const effectivePeriodRate = (1 + dailyRate)**daysBetweenPayments - 1;

  return (
    loanAmount *
    ((effectivePeriodRate * (1 + effectivePeriodRate)**totalPayments) /
      ((1 + effectivePeriodRate)**totalPayments - 1))
  );
};

const calculateRemainingPrincipal = (loanAmount: number, periodsElapsed: number, interestRate: number, isWeekly: boolean) => {
  if (loanAmount <= 0 || periodsElapsed <= 0) return loanAmount;

  const annualRate = interestRate / 100;
  const dailyRate = annualRate / DAYS_IN_YEAR;
  const daysBetweenPayments = isWeekly ? DAYS_IN_WEEK : DAYS_IN_MONTH;
  const effectivePeriodRate = (1 + dailyRate)**daysBetweenPayments - 1;

  const periodRepayment = calculateRepayment(loanAmount, interestRate, isWeekly);

  const remainingBalance =
    loanAmount * (1 + effectivePeriodRate)**periodsElapsed -
    periodRepayment * (((1 + effectivePeriodRate)**periodsElapsed - 1) / effectivePeriodRate);

  return Math.max(0, remainingBalance);
};

const calculateInterestCost = (loanAmount: number, periodsElapsed: number, interestRate: number, isWeekly: boolean) => {
  const totalPaid = calculateRepayment(loanAmount, interestRate, isWeekly) * periodsElapsed;
  const principalPaid = loanAmount - calculateRemainingPrincipal(loanAmount, periodsElapsed, interestRate, isWeekly);
  return Math.max(0, totalPaid - principalPaid);
};


const StatCell = ({
    startValue,
    endValue,
    title,
    description,
    ...boxProps
  }: BoxProps & { startValue: AnimatedCounterProps['startValue']; endValue: AnimatedCounterProps['endValue']; title: string; description: string }) => (
    <motion.div
      initial={{ opacity: 0.0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <Box {...boxProps}>
        <AnimatedCounter ta="center" fz={rem(64)} fw="bold" c={{base: "white",md:"#01E194"}} endValue={Math.max(0, endValue)} prefix="$" startValue={Math.max(0, startValue)}  />
        <Text fz="lg" inline ta="center" c={{base: "white",md:"white"}}>
          {description}
        </Text>
      </Box>
    </motion.div>
  );

  const PayoutCell = ({
    startValue,
    endValue,
    title,
    description,
    payoutStartValue,
    payoutEndValue,
    payout,
    ...boxProps
  }: BoxProps & { startValue: AnimatedCounterProps['startValue']; endValue: AnimatedCounterProps['endValue']; title: string; 
    description: string; payout: string; payoutStartValue: AnimatedCounterProps['startValue']; payoutEndValue: AnimatedCounterProps['endValue'] }) => (
    <motion.div
      initial={{ opacity: 0.0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <Box {...boxProps}
        style={{
            border:"2px solid #01E194",
            radius: '1rem',
            borderRadius: '1rem',
            padding: '10px'
        }}
      >
        <AnimatedCounter c="white" ta="center" fz={rem(32)} fw="bold" endValue={Math.max(0, endValue)} prefix="$" startValue={Math.max(0, startValue)} />
        <Group justify="center" gap={5}>
          <Text c="#01E194" fz="lg">
            Total Interest Cost
          </Text>
          <Text fz="lg" c="white" fw="500">
            {description}
          </Text>
        </Group>
      </Box>
    </motion.div>
  );


const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

const LineChart = ({ loanAmount, interestRate, isWeekly }: { loanAmount: number, interestRate: number, isWeekly: boolean }) => {
  // Convert periods to appropriate time units
  const periodMultiplier = isWeekly ? 4.33 : 1; // Approximate weeks per month
  const periods = isWeekly ? 
    [13, 17.3, 21.6, 26] : // weeks
    [1, 2, 3, 4]; // months

  const interestCosts = periods.map(period => 
    calculateInterestCost(loanAmount, period, interestRate, isWeekly).toFixed(2)
  );

  const data = {
    labels: ['30', '60', '90', '120'],
    datasets: [
      {
        label: 'Total Interest Cost',
        data: interestCosts,
        backgroundColor: [
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
        ],
        borderColor: [
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options= {
    barPercentage: 1.25,
    categoryPercenage: 1.0,
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: 'y' as const,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: { 
          display: false,
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'white',
          font: {
            size: 24,
          },
        },
        title: {
          text: 'Days',
          display: true,
          color: 'white',
          font: {
            size: 24,
          }
        }
      }
    },
    plugins: {
      datalabels: {
        color: 'white',
        formatter(value : number, context: Context) {
          return `$${  Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        },
        font: {
          size: 18
        }
      },
      legend: {
        display: false,
      },
    }
  };

  return (
    <>
      <style>
        {`
          .chart-container {
            width: 100%;
            height: 80%;
            background-color: black;
            padding-left: 2vw;
            min-height: 10px;
          }
  
          @media (max-width: 768px) {
            .chart-container {
              min-height: 200px;
            }
          }
        `}
      </style>
      <div className="chart-container">
        <motion.div
          initial={{ opacity: 0.0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <JumboTitle ta="center" fz="xs" order={1} fw="bold" c="#01E194" mt="xl" pt={0} visibleFrom='md'>
            Total Interest Cost if Paid Out Early
          </JumboTitle>
        </motion.div>
        <motion.div
          initial={{ opacity: 0.0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            width: '100%',
            height: '100%'
          }}
        >
        <Container style={{ width: '100%', height: '100%', maxHeight: '400px' }} p={0} visibleFrom='md'>
          <Bar data={data} plugins={[ChartDataLabels]} options={options} />
        </Container>
        </motion.div>
      </div>
    </>
  );
};


export const Calculator = () => {
  const [baseValue, setBaseValue] = useState(5000);
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST_RATE);
  const [isWeekly, setIsWeekly] = useState(false);
  
  const repayment = calculateRepayment(baseValue, interestRate, isWeekly);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  
  return (
    <Grid
      gutter='xl'
      my={{
        base: 'calc(var(--mantine-spacing-lg) * 1)',
        xs: 'calc(var(--mantine-spacing-lg) * 1)',
        lg: 'calc(var(--mantine-spacing-lg) * 1)',
      }}
      px={{
        base: "xl"
      }}
      style={ { marginTop: '0px', paddingTop: '0px' }}
      bg="black"
    >
      <Grid.Col span={{ base: 12, md: 12}} bg="black" mb="md">
        <Stack align="center" gap="xs" my="xl">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <span>
              <JumboTitle order={3} fz="xs" ta="center" style={{ textWrap: 'balance' }} hiddenFrom='lg' c={{base: "white",md:"#01E194"}}>
                Calculate your estimated
              </JumboTitle>
              <JumboTitle order={3} fz="xs" ta="center" style={{ textWrap: 'balance' }} hiddenFrom='lg' c={{base: "#01E194",md:"#01E194"}}>
                {isWeekly ? 'weekly' : 'monthly'} repayment
              </JumboTitle>
            </span>
            <Grid align="center" visibleFrom='lg' gutter="xl">
              <Grid.Col span={12}>
                <span>
                  <JumboTitle order={3} fz="xs" ta="center" style={{ textWrap: 'balance' }} c={{base: "white",md:"white"}} fw={600}>
                    Calculate your
                  </JumboTitle>
                  <JumboTitle order={3} fz="xs" ta="center" style={{ textWrap: 'balance' }} c={{base: "01E194",md:"#01E194"}} fw={600}>
                    {isWeekly ? 'weekly' : 'monthly'} repayment
                  </JumboTitle>
                </span>
            </Grid.Col>
          </Grid>
          </motion.div>
        </Stack>
        
        <Container size="lg" mt="calc(var(--mantine-spacing-md) * 1)" ta="center" px={{base:'0px', md:"xs"}}>
          <motion.div initial={{ opacity: 0.0, y: 0 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Stack>
              <TextInput
                label="Loan Amount"
                type="text"
                value={baseValue.toLocaleString()}
                onChange={(event) => {
                  const rawValue = event.currentTarget.value.replace(/,/g, ''); // remove commas
                  const numericValue = Math.max(0, Number(rawValue));
                  setBaseValue(numericValue);
                }}
                variant="unstyled"
                leftSection="$"
                size='xl'
                styles={{
                  input: { fontSize: rem(40), color: isMobile? 'white': 'white'},
                  label: { fontSize: rem(40), color: isMobile? 'white': 'white'},
                  section:  { fontSize: rem(40), color: isMobile? 'white': 'white'} 
                }}
                ta="center"
                c={{base: "white", md:"#01E194"}}
              />
              <Slider
                label="Loan Amount"
                min={5000}
                max={200000}
                step={1000}
                value={baseValue}
                onChange={(value) => setBaseValue(Math.max(0, value))}
                c={{base: "white",md:"#01E194"}}
              />              
              </Stack>
          </motion.div>
          
          <Grid gutter="calc(var(--mantine-spacing-lg) * 4)" align="center" px={0}>
            <Grid.Col span={{ base: 12, md: 12 }} mx={0} px={0}>
              <StatCell 
                startValue={baseValue} 
                endValue={repayment} 
                title={isWeekly ? "Weekly Repayment" : "Monthly Repayment"} 
                description={isWeekly ? "Weekly repayment" : "Monthly repayment"} 
              />
            </Grid.Col>
          </Grid>
          
          <Box>
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >  
              <JumboTitle ta="center" fz="xs" order={1}  fw="bold" c="#01E194" mt="xl" mb="xl" pt="xl">
                Payout Options
              </JumboTitle>
              {/* <JumboTitle ta="center" fz="xxs" order={3}  fw="bold" c="#01E194" mt="xl" mb="xl" textWrap='balance'>
                Save money with no penalties for early payout 
              </JumboTitle> */}
            </motion.div>
            
            <Grid gutter="calc(var(--mantine-spacing-lg) * 1)" align="center">
              <Grid.Col span={{ base: 6, sm: 6, md: 3 }}> {/* 3 month payout */}
                <PayoutCell
                  startValue={baseValue}
                  endValue={calculateInterestCost(baseValue, isWeekly ? 4.25 : 1, interestRate, isWeekly)} // 3 months
                  payoutStartValue={baseValue}
                  payoutEndValue={calculateRemainingPrincipal(baseValue, isWeekly ? 4.25 : 1, interestRate, isWeekly)}
                  title="3 Month Balance"
                  description="if paid out in full within 30 days "
                  payout='Principal Remaining'
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 6, md: 3 }}> {/* 6 month payout */}
                <PayoutCell
                  startValue={baseValue}
                  endValue={calculateInterestCost(baseValue, isWeekly ? 26 : 2, interestRate, isWeekly)}
                  payoutStartValue={baseValue}
                  payoutEndValue={calculateRemainingPrincipal(baseValue, isWeekly ? 8.5 : 2, interestRate, isWeekly)}
                  title="6 Month Balance"
                  description="if paid out in full within 60 days"
                  payout='Principal Remaining'
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 6, md: 3 }}> {/* 12 month payout */}
                <PayoutCell
                  startValue={baseValue}
                  endValue={calculateInterestCost(baseValue, isWeekly ? 52 : 3, interestRate, isWeekly)}
                  payoutStartValue={baseValue}
                  payoutEndValue={calculateRemainingPrincipal(baseValue, isWeekly ? 52 : 3, interestRate, isWeekly)}
                  title="12 Month Balance"
                  description="if paid out in full within 90 days "
                  payout='Principal Remaining'
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 6, md: 3 }}> {/* 12 month payout */}
                <PayoutCell
                  startValue={baseValue}
                  endValue={calculateInterestCost(baseValue, isWeekly ? 52 : 4, interestRate, isWeekly)}
                  payoutStartValue={baseValue}
                  payoutEndValue={calculateRemainingPrincipal(baseValue, isWeekly ? 52 : 4, interestRate, isWeekly)}
                  title="12 Month Balance"
                  description="if paid out in full within 120 days"
                  payout='Principal Remaining'
                />
              </Grid.Col>
            </Grid>
          </Box>
        </Container>
      </Grid.Col>
      {/* <Grid.Col span={{ base: 12, md: 6 }} visibleFrom='md'>
        <LineChart loanAmount={baseValue} interestRate={interestRate} isWeekly={isWeekly}/>
      </Grid.Col> */}
    </Grid>
  );
};