'use client';

import { useState, useContext } from 'react';
import { IconArrowUp } from '@tabler/icons-react';
import { motion } from 'motion/react';
import {
  Button,
  Container,
  rem,
  Slider,
  Stack,
  Text,
  TextInput,
  Grid,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {JumboTitle} from '../JumboTitle/JumboTitle';
import { CalculatorContext } from './CalculatorContext';
import { PartnerContext } from '@/components/PartnerContext';

export default function CalculatorSlider() {
  const ctx = useContext(CalculatorContext);
  const { baseValue, isMobile, setBaseValue, maxLoanAmount, minLoanAmount, startingAmount } = ctx
  const theme = useMantineTheme();
  const partner = useContext(PartnerContext);
  return (
    <div>
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
        pt={isMobile ? 0 : 'xs'}
        px={isMobile ? 0 : 'md'}
        pb={isMobile ? 'md' : 'xl'}
        style={{ height: '100%' }}
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
                  const capped = Math.min(parsed, maxLoanAmount);
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
                  const capped = Math.max(5000, parsed);
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
              c={{ base: 'white', md: theme.colors.secondary[0] }}
              rightSection={
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => {
                    setBaseValue(Math.min(baseValue, maxLoanAmount));
                    sessionStorage.setItem('loanAmount', baseValue.toString());
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
                Finance available between $5,000 and $500,000 regardless of outstanding balance
              </Text>
              <Slider
                px="xl"
                min={minLoanAmount}
                max={maxLoanAmount}
                step={1000}
                value={baseValue}
                onChange={(value) => {
                  setBaseValue(Math.max(0, value));
                  sessionStorage.setItem('loanAmount', value.toString());
                  console.log('Loan Amount set to:', sessionStorage.getItem('loanAmount'));
                }}
                c={{ base: 'white', md: theme.colors.secondary[0] }}
                mx={isMobile ? 'xs' : 0}
                marks={
                  startingAmount > 0
                    ? [
                        {
                          value: startingAmount,
                          label: (
                            partner && (
                            <div>
                              <IconArrowUp style={{ marginBottom: '0px', paddingBottom: '0px' }} />
                              <p style={{ margin: '0px' }}>Your balance</p>
                              <p style={{ margin: '0px' }}>with {partner.displayName}</p>
                            </div>
                            )
                          ),
                        },
                      ]
                    : []
                }
                size="xl"
                styles={{
                  markLabel: {
                    color: 'orange',
                  },
                }}
              />
            </Stack>
          </Stack>
        </motion.div>
      </Container>
    </div>
  );
}
