'use client';

import { Calculator } from '@/components/Calculator3/Calculator';
import { FAQ } from '@/components/FAQ/Faq';
import { Feature02 } from '@/components/feature-02';
import { Footer01 } from '@/components/footer/footer';
import { Hero03 } from '@/components/Hero03/index';
import { IntroSection } from '@/components/Intro';
import { Header } from '@/components/Partner';
import { UnsavedChangesProvider } from '@/components/unsavedChanges';
import { UseCases } from '@/components/UseCases/Usecases';

interface LowTouchClientProps {
  partner?: string;
}

export default function LowTouchClient({ partner }: LowTouchClientProps) {
  return (
    <div
      style={{
        opacity: 0,
        animation: 'fadeIn 1s ease-in-out forwards',
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
      <UnsavedChangesProvider>
        <Header />
        <Hero03 partner={partner} />
        <IntroSection />
        <Feature02 />
        <section id="contact">
          <Calculator prefilled={false} />
        </section>
        <UseCases />
        <FAQ />
        <Footer01 />
      </UnsavedChangesProvider>
    </div>
  );
}
