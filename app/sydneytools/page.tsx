import LowTouchClient from './clientComponent';
import { partnerConfig } from '@/lib/partnerConfig';

export default async function HomePage(props: {
  params: Promise<{ partner: string }>;
}) {
  const params = 'sydneytools';
  const key = params as keyof typeof partnerConfig;
  const config = partnerConfig[key] ?? partnerConfig.default;
  return <LowTouchClient partner={config} />;
}
