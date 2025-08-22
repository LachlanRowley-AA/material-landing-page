'use client';

import { Suspense } from 'react';
import { LoadingFallback } from '@/components/LoadingFallback';

export function ClientSuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}
