import DBM_DataLoaderServer from '@/components/DBM_DataLoaderServer';
import HomepageClient from '@/components/HomepageClient';

export default async function PrefillPage({ 
  searchParams 
}: { 
  searchParams: Promise<Record<string, string | string[] | undefined>> 
}) {
  const resolvedSearchParams = await searchParams;
  const rawKey = resolvedSearchParams.accountKey;
  const accountKey = typeof rawKey === 'string' ? rawKey : null;
  
  return (
    <DBM_DataLoaderServer accountKey={accountKey}>
      {({ userDetails, parsedBalance }) => (
        <HomepageClient userDetails={userDetails} parsedBalance={parsedBalance} />
      )}
    </DBM_DataLoaderServer>
  );
}