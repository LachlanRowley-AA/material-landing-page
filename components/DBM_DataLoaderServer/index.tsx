// DBM_DataLoaderContent.tsx
import HomepageClient from '@/components/HomepageClient';
import { UserDetails } from '@/lib/UserDetails';

interface Props {
  accountKey: string | null;
}

export default async function DBM_DataLoaderContent({ accountKey }: Props) {
  let userDetails: UserDetails | null = null;
  let parsedBalance = 0;

  if (accountKey) {
    try {
      console.log('Fetching now: ', Date.now());
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbxE7C_cBbmcK6WkX8r1LhzmksN1jS_U_dpEaE-oYbrHWBQxkuOk5jPlGF3y25MtrNpO/exec?accountKey=${encodeURIComponent(accountKey)}`,
        { cache: 'no-store' }
      );
      console.log('Fetch completed: ', Date.now());

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      userDetails = data.data;

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
