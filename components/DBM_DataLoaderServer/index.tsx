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

      if(userDetails) {
        userDetails.name = userDetails.name.replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 &_-]/g, "_")
        userDetails.company = userDetails.company.replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 _&-]/g, "_")

      }

      if (!data.success) {
        console.log('failed to find');
      }

      let rawBalance = userDetails?.balance;
      if (rawBalance === '') {
        rawBalance = 0;
      }
      parsedBalance =
        typeof rawBalance === 'string'
          ? parseFloat(rawBalance.replace(/[\$,]/g, ''))
          : typeof rawBalance === 'number'
          ? rawBalance
          : 0;
      console.log('parsedBalance: ', parsedBalance);
    } catch (err) {
      console.error('Server-side fetch error:', err);
    }
  }

  return <HomepageClient userDetails={userDetails} parsedBalance={parsedBalance} />;
}
