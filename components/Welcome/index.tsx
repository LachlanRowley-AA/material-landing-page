'use client';

import React, { useEffect, useState } from 'react';
import {
  Paper,
  Text,
  Title,
  Group,
  Skeleton,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { IconCheck, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export default function Welcome({name} : { name?: string}) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        mx="xl"
        withBorder
        style={{
          background: 'linear-gradient(135deg, #fff8f0, #ffffff)',
          borderLeft: '6px solid #fc8900',
          position: 'relative',
          overflow: 'hidden',
          animation: 'glowPulse 2.5s infinite ease-in-out',
        }}
      >
        <style>
          {`
            @keyframes glowPulse {
              0% {
                box-shadow: 0 0 0px rgba(252, 137, 0, 0.3);
              }
              50% {
                box-shadow: 0 0 16px rgba(252, 137, 0, 0.6);
              }
              100% {
                box-shadow: 0 0 0px rgba(252, 137, 0, 0.3);
              }
            }
          `}
        </style>
        <Group align="center" mb="sm">
          <div>
            {name && <Title order={2} fw={700} style={{ color: '#fc8900' }}>
              {name ? `Hi ${name},` : <Skeleton width={120} height={28} />}
            </Title>}
            <Text size="xl" mt={4} c="black">
              Apply to pay your invoice in flexible monthly instalments — no upfront cost required.
            </Text>
          </div>
        </Group>

        <Group mt="md">
          <ThemeIcon color="#fc8900" size={24} radius="xl" variant="light" style={{ backgroundColor: '#ffe1c2' }} visibleFrom="md">
            <IconCheck size={16} />
          </ThemeIcon>
          <Text size="lg" fw={500} c="#333">
            Flexible repayments tailored to your cash flow
          </Text>
        </Group>
      </Paper>
    </motion.div>
  );
}
