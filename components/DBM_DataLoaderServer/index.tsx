// DBM_DataLoaderContent.tsx
import HomepageClient from '@/components/HomepageClient';
import { UserDetails } from '@/lib/UserDetails';
import GetData from './GetData';

interface Props {
  accountKey: string | null;
}

export default async function DBM_DataLoaderContent({ accountKey }: Props) {
  let userDetails: UserDetails | null = null;
  let parsedBalance = 0;

  if (accountKey) {
    try {
      const data = await GetData(accountKey);

      userDetails = data.data;
      console.log('user details: ', userDetails);
      console.log('success: ', data.success);

      if (!data.success) {
        console.log('failed to find');
      }

      const rawBalance = userDetails?.balance;
      parsedBalance =
        typeof rawBalance === 'string'
          ? parseFloat(rawBalance.replace(/[\$,]/g, ''))
          : typeof rawBalance === 'number'
          ? rawBalance
          : 0;

    } catch (err) {
      console.error('Server-side fetch error:', err);
    }
  }

  return <HomepageClient userDetails={userDetails} parsedBalance={parsedBalance} />;
}
