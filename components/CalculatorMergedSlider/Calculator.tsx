'use client';

import { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { Box, Button, Center, Container, Group, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { AgreementWidget } from './AgreementWidget';
import { CalculatorProvider } from './CalculatorContext';
import CalculatorOptions from './Options';
import ProductChoice from './ProductGuide';
import CalculatorProducts from './Products';
import CalculatorModal from './ProductsModal';
import CalculatorSlider from './Slider';

type CalculatorProps = {
  startingAmount?: number;
};

export const Calculator = ({ startingAmount = 0 }: CalculatorProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track confirm button visibility per step
  const [showConfirm, setShowConfirm] = useState<boolean[]>([true, false, false]);

  const next = () => setActiveIndex((prev) => (prev + 1) % menus.length);
  const prev = () => setActiveIndex((prev) => Math.min((prev - 1 + menus.length) % menus.length, 0));

  const enableConfirm = (index: number) => {
    setShowConfirm((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };
  const disableConfirm = (index: number) => {
    setShowConfirm((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const menus = [
    { component: <CalculatorSlider />, showConfirm: showConfirm[0] },
    {
      component: (
        <CalculatorProducts
          onProductClick={() => enableConfirm(1)}
          incompleteClick={() => disableConfirm(1)}
        />
      ),
      showConfirm: showConfirm[1],
    },
    { component: <AgreementWidget showDataShareCheckbox={false} />, showConfirm: showConfirm[2] },
  ];
  

  return (
    <CalculatorProvider startingAmount={startingAmount}>
      <Box
        bg="#F2F5F8"
        py={isMobile ? 'sm' : 'xl'}
        style={{
          width: '100%',
          overflowX: 'hidden',
        }}
        px={0}
      >
        <Container size="xl">
          {/* Card container */}
          <Box
            style={{
              maxWidth: 1600,
              margin: '0 auto',
              borderRadius: '1rem',
              boxShadow: '0 0 12px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative', // relative for the background
              overflow: 'hidden', // clip animated background
            }}
            h="100%"
            pb="md"
            bg='white'
          >
            {/* Card content */}
            <Box
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <Center>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ width: '100%' }}
                  >
                    {menus[activeIndex].component}
                  </motion.div>
                </AnimatePresence>
              </Center>

              {/* Navigation pinned at bottom */}
              <Box mt="auto">
                <Group gap="sm" justify="center" py="md" align="flex-end">
                  <Button variant="light" onClick={prev}>
                    <IconChevronLeft />
                    Go back
                  </Button>
                  {menus[activeIndex].showConfirm && (
                    <Button variant="light" onClick={next}>
                      Continue
                      <IconChevronRight />
                    </Button>
                  )}
                </Group>

                <Group justify="center" gap="xs" align="flex-end">
                  {menus.map((_, index) => (
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
                    />
                  ))}
                </Group>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </CalculatorProvider>
  );
};
