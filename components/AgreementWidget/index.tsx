'use client';

import { useRouter } from 'next/navigation';
import { Anchor, Button, Card, Checkbox, Group, Text } from '@mantine/core';
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

    if (isDesktop) {
      window.open('/application', '_blank', 'noopener,noreferrer');
    } else {
      router.push('/application');
    }
  };

  return (
    <Card>
      <Checkbox
        label="I agree to share my data with Asset Alley"
        checked={dataShareTicked}
        onChange={(event) => setDataShare(event.currentTarget.checked)}
      />
      <Checkbox
        label={
          <>
            I accept the{' '}
            <Anchor size="sm" href="/privacyform">
              privacy policy{' '}
            </Anchor>
            of Asset Alley
          </>
        }
      />
      {error && (
        <Text c="red" size="sm" mt="xs">
          {error}
        </Text>
      )}
      <Group mt="md">
        <Button>Lodge your interest and we'll be in touch shortly</Button>
        <Text>Or</Text>
        <Button onClick={handleCompleteApplication}>
          Complete an application now
        </Button>
      </Group>
    </Card>
  );
};
