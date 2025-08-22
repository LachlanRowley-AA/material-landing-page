// app/dbm/prefill/page.tsx

import { Suspense } from 'react';
import { Center, Loader, Text, Stack } from '@mantine/core';
import DemoDataLoader from './demoDataLoader';

export default async function PrefillPage() {

  return (
    <Suspense fallback={
      <Center style={{ height: '100vh' }}>
        <Stack>
          <Loader />
          <Text ta="center">Loading your account data...</Text>
        </Stack>
      </Center>
    }>
      <DemoDataLoader/>
    </Suspense>
  );
}
