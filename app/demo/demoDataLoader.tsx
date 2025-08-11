import HomepageClient from '@/components/HomepageClient';
import { UserDetails } from '@/lib/UserDetails';

export default async function DemoDataLoader() {
  let userDetails: UserDetails | null = null;
  let parsedBalance = 0;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/getDemoData`);

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

  return <HomepageClient userDetails={userDetails} parsedBalance={parsedBalance} />;
}
