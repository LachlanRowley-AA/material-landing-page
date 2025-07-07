'use client';

import { useRouter } from 'next/navigation';
import { Anchor, Button, Card, Checkbox, Group, Text, Image } from '@mantine/core';
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
    if (isDesktop) {
      router.push('/application');
//      window.open('/application', '_blank', 'noopener,noreferrer');
    } else {
      router.push('/application');
    }
  };

  return (
    <Card radius="md" withBorder h="100%" pb={0} mb={0}>
      <Image src="/assetalley.svg" p="md"/>
      <Checkbox
        label="I agree to share my data with Asset Alley"
        checked={dataShareTicked}
        onChange={(event) => setDataShare(event.currentTarget.checked)}
        pb="md"
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
        <Button mt="xl">Lodge your interest and we'll be in touch shortly</Button>
        <Text size="xl">Or</Text>
        <Button onClick={handleCompleteApplication}>
          Complete an application now
        </Button>
    </Card>
  );
};
