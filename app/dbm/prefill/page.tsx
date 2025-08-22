// app/dbm/prefill/page.tsx

import { Suspense } from 'react';
import { Center, Loader, Text, Stack } from '@mantine/core';
import DBM_DataLoaderContent from '@/components/DBM_DataLoaderServer';

export default async function PrefillPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawKey = resolvedSearchParams.accountKey;
  const accountKey = typeof rawKey === 'string' ? rawKey : null;

  return (
    <Suspense fallback={
      <Center style={{ height: '100vh' }}>
        <Stack>
          <Loader />
          <Text ta="center">Loading your account data...</Text>
        </Stack>
      </Center>
    }>
      <DBM_DataLoaderContent accountKey={accountKey} />
    </Suspense>
  );
}
