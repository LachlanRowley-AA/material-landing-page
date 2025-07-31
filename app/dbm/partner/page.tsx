import DBM_PartnerDataLoaderServer from '@/components/DBM_DataLoaderServer/Partner';
import HomepageClient from '@/components/HomepageClient';
import { Center, Loader, Text, Stack } from '@mantine/core';
import { Suspense } from 'react';

export default async function PrefillPage({ 
  searchParams 
}: { 
  searchParams: Promise<Record<string, string | string[] | undefined>> 
}) {
  const resolvedSearchParams = await searchParams;
  const rawKey = resolvedSearchParams.accountKey;
  const accountKey = typeof rawKey === 'string' ? rawKey : null;
  
  return (
    <Suspense fallback = {
      <Center style={{height: '100vh'}}>
        <Stack>
          <Loader />
          <Text ta="center">Loading your account data...</Text>
        </Stack>
      </Center>
    }
    >
      <DBM_PartnerDataLoaderServer accountKey={accountKey}>
        {({ userDetails, parsedBalance }) => (
          <HomepageClient userDetails={userDetails} parsedBalance={parsedBalance} />
        )}
      </DBM_PartnerDataLoaderServer>
    </Suspense>
  );
}