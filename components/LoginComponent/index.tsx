'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Box,
  Button,
  Group,
  Loader,
  Paper,
  PinInput,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Partner } from '@/lib/partnerConfig';

export default function Login({ partner }: { partner?: Partner }) {
  const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${partner?.displayName?.toLocaleLowerCase()}/prefill?accountKey=`;
  const router = useRouter();
  const [accountId, setAccountId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useMantineTheme();

  async function sendToPrefill(code: string) {
    if (!partner || !partner.accountGet) return;
    setLoading(true);
    setError(null);

    try {
      const result = await partner.accountGet(code);

      if (result.success === true) {
        router.push(baseUrl + code);
      } else {
        setError('Invoice number not found. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Paper
        shadow="xl"
        radius="lg"
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
              0% { box-shadow: 0 0 0px rgba(252, 137, 0, 0.3); }
              50% { box-shadow: 0 0 16px rgba(252, 137, 0, 0.6); }
              100% { box-shadow: 0 0 0px rgba(252, 137, 0, 0.3); }
            }
          `}
        </style>

        <Group align="center" mb="sm" w="100%" justify="center">
          <Text size="xl" mt={4} c="black" ta="center">
            Enter your {partner?.displayName} invoice number to prefill with your business' data
          </Text>

          <Group align="center" mb="sm" w="100%" justify="center">
            <PinInput length={6} type="number" onChange={setAccountId} />

            {loading ? (
              <Loader size="sm" type='oval' />
            ) : (
              <Button
                size="md"
                color={theme.colors.secondary[0]}
                style={{
                  color: '#fff',
                  fontWeight: 600,
                  boxShadow: '0 0 12px rgba(252, 137, 0, 0.5)',
                }}
                disabled={accountId.length < 6}
                onClick={() => sendToPrefill(accountId)}
              >
                Submit
              </Button>
            )}
          </Group>

          {error && (
            <Text size="sm" c="red" ta="center" mb="sm">
              {error}
            </Text>
          )}

          <Text
            size="sm"
            c="dimmed"
            ta="center"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            component="a"
            href={`/${partner?.displayName}/accountId-location.png`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Where do I find this?
          </Text>
        </Group>
      </Paper>
    </motion.div>
  );
}
