
import { ReactNode } from 'react';
import { UserDetails } from '@/lib/UserDetails';

interface DBM_DataLoaderServerProps {
  accountKey: string | null;
  children: (data: {
    userDetails: UserDetails | null;
    parsedBalance: number;
  }) => ReactNode;
}

export default async function DBM_DataLoaderServer({
  accountKey,
  children,
}: DBM_DataLoaderServerProps) {
  let userDetails: UserDetails | null = null;
  let parsedBalance = 0;

  if (accountKey) {
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbxE7C_cBbmcK6WkX8r1LhzmksN1jS_U_dpEaE-oYbrHWBQxkuOk5jPlGF3y25MtrNpO/exec?accountKey=${encodeURIComponent(accountKey)}`,
        { cache: 'no-store' }
      );

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