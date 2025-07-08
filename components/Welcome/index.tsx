'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Text, Title, Group, Skeleton, ThemeIcon } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export default function Welcome() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setName(parsed.name || null);
      } catch (error) {
        console.error('Invalid userData in sessionStorage:', error);
      }
    }
  }, []);

  return (
    <Paper
      shadow="md"
      radius="md"
      p="xl"
      withBorder
      style={{
        background: '#f6f6f6',
      }}
    >
      <Group position="apart" align="center" mb="sm">
        <div>
          <Title order={3} style={{ color: '#2d3748' }}>
            {name ? `Hi ${name},` : <Skeleton width={120} height={24} />}
          </Title>
          <Text size="md" color="dimmed" mt={4}>
            Apply for finance to pay your invoice in flexible monthly instalments — no upfront cost required.
          </Text>
        </div>
      </Group>

      <Group mt="sm" spacing="xs">
        <ThemeIcon color="teal" size={20} radius="xl">
          <IconCheck size={14} />
        </ThemeIcon>
        <Text size="sm">Flexible repayments tailored to your cash flow</Text>
      </Group>
    </Paper>
  );
}
