'use client';

import { Box, Container, Grid, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { AgreementWidget } from '@/components/AgreementWidget';
import { CalculatorProvider } from './CalculatorContext';
import Calculatorptions from './Options';
import CalculatorSlider from './Slider';

type CalculatorProps = {
  startingAmount?: number;
};
export const Calculator = ({ startingAmount = 50000 }: CalculatorProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  return (
    <CalculatorProvider startingAmount={startingAmount}>
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
            mx={0}
            px="0px"
            style={{
              marginTop: '0px',
              paddingTop: '0px',
              minHeight: '100%',
              height: 'auto',
            }}
            overflow="hidden"
            bg="white"
          >
            {/* First Column - Original Calculator */}
            <Grid.Col
              span={isMobile ? 12 : 4}
              bg="white"
              pt={isMobile ? 'xs' : 'md'}
              px={isMobile ? 'xs' : 'md'}
              pb={isMobile ? 'md' : 'xl'}
              style={{ minHeight: '100%' }}
            >
              <CalculatorSlider />
            </Grid.Col>

            {/* Second Column - Chart */}
            <Grid.Col
              span={isMobile ? 12 : 5}
              pt={isMobile ? 'xl' : 'md'}
              px={isMobile ? 'xs' : 'md'}
              pb={isMobile ? 'md' : 'xl'}
            >
              <Calculatorptions />
            </Grid.Col>
            <Grid.Col span={isMobile ? 12 : 3}>
              <Container px="xl">
                <AgreementWidget showDataShareCheckbox />
              </Container>
            </Grid.Col>
          </Grid>
        </Box>
      </Box>
    </CalculatorProvider>
  );
};
