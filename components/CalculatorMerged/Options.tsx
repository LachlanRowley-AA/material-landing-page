'use client';

import { useEffect, useState, useContext } from 'react';
import { motion } from 'motion/react';
import {
  Box,
  Button,
  Container,
  Grid,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
  Group,
  Switch,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { JumboTitle } from '../JumboTitle/JumboTitle';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CalculatorContext } from './CalculatorContext';


export default function CalculatorOptions() {
  const [showGraph, setShowGraph] = useState(false);
  const [customTimeframe, setCustomTimeframe] = useState('12');
  const ctx = useContext(CalculatorContext);
  const { baseValue, isMobile, defaultInterestRate,  } = ctx;
  const theme = useMantineTheme();

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

  // Calculate data for all timeframes
  const timeframes = [6, 12, 24, 36];
  const chartData = timeframes.map((months) => {
    const monthlyPayment =
      months === 6
        ? calculateCustomRepayment(baseValue, 20.0, months)
        : calculateCustomRepayment(baseValue, defaultInterestRate, months);
    const totalInterest = monthlyPayment * months - baseValue;
    const isSelected = months === parseInt(customTimeframe, 10);
    return {
      months: months,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(Math.max(0, totalInterest)),
      label: `${months} months`,
      color: isSelected ? '#FFA500' : theme.colors.secondary[0], // Orange for selected, green for others
    };
  });

  return (
    <div>
      <Stack align="center" gap="x" my={isMobile ? 'md' : 'xl'}>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ width: '100%' }}
        >
          <JumboTitle
            order={3}
            fz="xs"
            ta="center"
            style={{ textWrap: 'balance' }}
            c={{ base: 'black', md: 'black' }}
            fw={600}
          >
            Compare and select payment options
          </JumboTitle>
          <Text pt="md" ta="center" fs="italic">
            All plans may be paid out at any time without paying any remaining interest
          </Text>
        </motion.div>
      </Stack>

      <Container
        size="lg"
        mt="md"
        ta="center"
        pt={isMobile ? 0 : 'md'}
        px={isMobile ? 0 : 'md'}
        pb={isMobile ? 'md' : 'xl'}
        style={{ height: '100%' }}
      >
        <motion.div
          initial={{ opacity: 0.0, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Stack gap={isMobile ? 'md' : 'xs'}>
            {showGraph && (
              <Box style={{ height: '400px' }}>
                <Container size="lg" ta="center" px={isMobile ? 0 : 'md'} pb={0}>
                  <motion.div
                    initial={{ opacity: 0.0, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Stack gap={isMobile ? 'md' : 'xl'}>
                      <SegmentedControl
                        value={customTimeframe}
                        onChange={(value) => {
                          setCustomTimeframe(value);
                          sessionStorage.setItem('customTimeframe', value);
                          console.log(
                            'Custom Timeframe set to:',
                            sessionStorage.getItem('customTimeframe')
                          );
                        }}
                        data={[
                          { label: '6 months', value: '6' },
                          { label: '12 months', value: '12' },
                          { label: '24 months', value: '24' },
                          { label: '36 months', value: '36' },
                        ]}
                        size="md"
                        styles={{
                          root: {
                            backgroundColor: '#f8f9fa',
                          },
                          control: {
                            '&[dataActive]': {
                              backgroundColor: theme.colors.secondary[0],
                              color: 'white',
                            },
                          },
                        }}
                      />
                    </Stack>
                  </motion.div>
                </Container>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      type="number"
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                      fontSize={12}
                    />

                    <YAxis dataKey="label" type="category" fontSize={12} width={100} />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                      dataKey="monthlyPayment"
                      name="Estimated Monthly Payment"
                      radius={[0, 4, 4, 0]}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
            {!showGraph && (
              <Box
                h={400}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
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
                          setCustomTimeframe(String(item.months));
                          sessionStorage.setItem('customTimeframe', String(item.months));
                          console.log(
                            'Custom Timeframe set to:',
                            sessionStorage.getItem('customTimeframe')
                          );
                        }}
                      >
                        <Box w="100%">
                          <Text fw="600" c="black" fz="sm" ta="center">
                            {item.months} months
                          </Text>
                          <Text c={item.color} fz="lg" fw="bold" ta="center">
                            ${item.monthlyPayment.toLocaleString()}
                          </Text>
                          <Text c="dimmed" fz="xs" ta="center">
                            estimated monthly payment
                          </Text>
                        </Box>
                      </Button>
                    </Grid.Col>
                  ))}
                </Grid>
              </Box>
            )}
            <Group justify="flex-end" w="100%" visibleFrom="md">
              <Switch
                onChange={(event) => setShowGraph(event.currentTarget.checked)}
                checked={showGraph}
              />
              <Text>Toggle graph display</Text>
            </Group>
          </Stack>
        </motion.div>
      </Container>
    </div>
  );
}
