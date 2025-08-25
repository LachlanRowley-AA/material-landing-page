'use client';

import { Calculator } from '@/components/Calculator3/Calculator';
import { FAQ } from '@/components/FAQ/Faq';
import { Feature02 } from '@/components/feature-02';
import { Footer01 } from '@/components/footer/footer';
import { Hero03 } from '@/components/Hero03/index';
import Login from '@/components/LoginComponent';
import { PartnerContext } from '@/components/PartnerContext';
import { UnsavedChangesProvider } from '@/components/unsavedChanges';
import { UseCases } from '@/components/UseCases/Usecases';
import { Partner } from '@/lib/partnerConfig';

interface LowTouchClientProps {
  partner?: Partner;
}

export default function LowTouchClient({ partner }: LowTouchClientProps) {
  const content = (
    <UnsavedChangesProvider>
      <Hero03 partner={partner?.displayName} />
      <Feature02 />
      {partner?.hasHighTouch && <Login partner={partner} />}
      <section id="contact">
        <Calculator prefilled={false} />
      </section>
      <UseCases />
      <FAQ />
      <Footer01 />
    </UnsavedChangesProvider>
  );

  return (
    <div
      style={{
        opacity: 0,
        animation: 'fadeIn 2s ease-in-out forwards',
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {partner ? (
        <PartnerContext.Provider value={partner}>
          {content}
        </PartnerContext.Provider>
      ) : (
        content
      )}
    </div>
  );
}
