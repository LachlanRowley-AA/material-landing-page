
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/partner-data?accountKey=${encodeURIComponent(accountKey)}`,
        { cache: 'no-store' }
      );

      const data = await res.json();

      userDetails = data?.data ?? null;

      const rawBalance = userDetails?.balance;
      parsedBalance =
        typeof rawBalance === 'string'
          ? parseFloat(rawBalance.replace(/[\$,]/g, ''))
          : typeof rawBalance === 'number'
            ? rawBalance
            : 0;
    } catch (err) {
      console.error('Server-side API fetch failed:', err);
    }
  }

  return <>{children({ userDetails, parsedBalance })}</>;
}
