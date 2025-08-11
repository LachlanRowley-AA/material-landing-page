'use client';

import { useQRCode } from 'next-qrcode';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Image,
  Paper,
  PaperProps,
  rem,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import classes from './index.module.css';

export const Example = () => {
  const { Canvas } = useQRCode();
  return (
    <Container
      bg="var(--mantine-color-body)"
      py={{
        base: 'calc(var(--mantine-spacing-lg) * 3)',
        xs: 'calc(var(--mantine-spacing-lg) * 3)',
        lg: 'calc(var(--mantine-spacing-lg) * 3)',
      }}
      fluid
    >
      <Container size="md">
        <Stack gap="xs" align="center">
          <JumboTitle order={2} fz="md" ta="center" style={{ textWrap: 'balance' }} mb="sm">
            Want to see it in action?
          </JumboTitle>
        </Stack>
      </Container>
      <Container size="xl">
        <Flex
          mt="calc(var(--mantine-spacing-lg) * 3)"
          gap="calc(var(--mantine-spacing-sm) * 3)"
          wrap="wrap"
          justify="center"
        >
          <Card withBorder radius="lg" shadow="lg" style={{ border: '2px solid black' }}>
            <Text fw={700} fz="xl" mb="md" ta="center">
              Invoice
            </Text>

            {/* Company & Invoice Info */}
            <Group align="apart" mb="lg" gap={32}>
              <Stack gap={4}>
                <Text fw={600}>Your Company Name</Text>
                <Text size="sm" color="dimmed">
                  123 Business Rd.
                  <br />
                  Business City, 45678
                  <br />
                  Email: info@company.com
                  <br />
                  Phone: (123) 456-7890
                </Text>{' '}
              </Stack>

              <Stack gap={4} align="flex-end">
                <Text fw={600}>Invoice #12345</Text>
                <Text size="sm" color="dimmed">
                  Date: 2025-08-08
                </Text>
                <Text size="sm" color="dimmed">
                  Due: 2025-08-22
                </Text>
              </Stack>
              <Stack gap={0}>
                <Canvas
                  key='qr-code'
                  text='https://www.eazytrade.com.au/demo'
                />
                <Text ta="center">Scan me</Text>
              </Stack>
            </Group>

            <Divider my="md" />

            {/* Bill To */}
            <Stack gap={4} mb="md">
              <Text fw={600}>Bill To:</Text>
              <Text size="sm" color="dimmed">
                Client Name
                <br />
                789 Client St.
                <br />
                Clienttown, 98765
                <br />
                client@example.com
              </Text>
            </Stack>

            {/* Items Table */}
            <Table verticalSpacing="md" striped highlightOnHover className={classes.invoiceTable}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ width: rem(100) }}>Qty</th>
                  <th style={{ width: rem(120) }}>Unit Price</th>
                  <th style={{ width: rem(120) }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Material</td>
                  <td>1</td>
                  <td>$1,000.00</td>
                  <td>$1,000.00</td>
                </tr>
                <tr>
                  <td>Material</td>
                  <td>3</td>
                  <td>$100.00</td>
                  <td>$300.00</td>
                </tr>
                <tr>
                  <td>Material</td>
                  <td>1</td>
                  <td>$12.00</td>
                  <td>$12.00</td>
                </tr>
              </tbody>
            </Table>

            <Divider my="md" />

            {/* Totals */}
            <Group align="right" gap="xl">
              <Stack gap={4} style={{ minWidth: rem(200) }}>
                <Group align="apart">
                  <Text color="dimmed">Subtotal</Text>
                  <Text>$1,312.00</Text>
                </Group>
                <Group align="apart">
                  <Text color="dimmed">GST (10%)</Text>
                  <Text>$131.20</Text>
                </Group>
                <Divider />
                <Group align="apart" fw={700} style={{ fontSize: rem(18) }}>
                  <Text>Total</Text>
                  <Text>$1,443.20</Text>
                </Group>
              </Stack>
            </Group>
          </Card>
        </Flex>
      </Container>
    </Container>
  );
};
export default Example;
