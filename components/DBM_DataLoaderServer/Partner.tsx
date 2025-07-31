
import { ReactNode } from 'react';
import { UserDetails } from '@/lib/UserDetails';

interface DBM_DataLoaderServerProps {
  accountKey: string | null;
  children: (data: {
    userDetails: UserDetails | null;
    parsedBalance: number;
  }) => ReactNode;
}

export default async function DBM_PartnerDataLoaderServer({
  accountKey,
  children,
}: DBM_DataLoaderServerProps) {
  let userDetails: UserDetails | null = null;
  let parsedBalance = 0;

  if (accountKey) {
    try {
      console.log('Fetching now: ', Date.now())
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbydtvQbFhphQj7RaL2PvMhHyty-R3auBMWncfX0PaYCFeVhXhgziONL_0qzsEDAH8R7ew/exec?accountKey=${encodeURIComponent(accountKey)}`,
        { cache: 'no-store' }
      );
      console.log('Fetch completed: ', Date.now())

      if (!response.ok) {throw new Error(`HTTP error ${response.status}`)};

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

  return <>{children({ userDetails, parsedBalance })}</>;
}