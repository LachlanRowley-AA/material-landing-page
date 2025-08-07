import { Suspense } from 'react';
import { Center, Loader, Text, Stack } from '@mantine/core';
import DBM_DataLoaderServer from '@/components/DBM_DataLoaderServer';

export default function PrefillPage({ 
  searchParams 
}: { 
  searchParams: Record<string, string | string[] | undefined> 
}) {
  const rawKey = searchParams.accountKey;
  const accountKey = typeof rawKey === 'string' ? rawKey : null;

  return (
    <Suspense fallback={
      <Center style={{height: '100vh'}}>
        <Stack>
          <Loader />
          <Text ta="center">Loading your account data...</Text>
        </Stack>
      </Center>
    }>
      <DBM_DataLoaderServer accountKey={accountKey} />
    </Suspense>
  );
}
