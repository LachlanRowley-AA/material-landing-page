'use client';

import { useRouter } from 'next/navigation';
import {
  Anchor,
  Button,
  Card,
  Checkbox,
  Group,
  Stack,
  Text,
  Image,
  Title,
  Box,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';

export const AgreementWidget = () => {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [dataShareTicked, setDataShare] = useState(false);
  const [error, setError] = useState('');

  const handleCompleteApplication = () => {
    if (!dataShareTicked) {
      setError('You must agree to share your data to proceed.');
      return;
    }

    setError('');
    console.log(sessionStorage.getItem('userData'));
    router.push('/application');
  };

  return (
    <Card
      radius="lg"
      withBorder
      p="xl"
      mt="md"
      bg="#ffffff"
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #eee',
      }}
    >
      <Stack spacing="md" align="center">
        <Image src="/assetalley.svg" w={160} alt="Asset Alley Logo" />

        <Title order={3} c="#fc8900">
          Let’s get started
        </Title>

        <Checkbox
          label="I agree to share my data with Asset Alley"
          checked={dataShareTicked}
          onChange={(event) => setDataShare(event.currentTarget.checked)}
          size="md"
        />
        <Checkbox
          size="md"
          label={
            <>
              I accept the{' '}
              <Anchor size="sm" href="/privacyform" c="#fc8900">
                privacy policy
              </Anchor>{' '}
              of Asset Alley
            </>
          }
        />

        {error && (
          <Text c="red" size="sm" mt="xs" ta="center">
            {error}
          </Text>
        )}

        <Box w="100%">
          <Button
            variant="light"
            fullWidth
            size="md"
            color="gray"
            mt="md"
          >
            Lodge your interest – we’ll be in touch
          </Button>
        </Box>

        <Text size="sm" c="dimmed">
          or
        </Text>

        <Box w="100%">
          <Button
            fullWidth
            size="md"
            color="#fc8900"
            style={{
              backgroundColor: '#fc8900',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 0 12px rgba(252, 137, 0, 0.5)',
            }}
            onClick={handleCompleteApplication}
          >
            Complete an application now
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};
