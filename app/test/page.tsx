'use client';

import { Calculator as Calc } from '@/components/Calculator/Calculator';
import { Calculator } from '@/components/Calculator3/Calculator';
import { Calculator as CalculatorMerged } from '@/components/CalculatorMergedSlider/Calculator';
// import Login from '@/components/LoginComponent';
import { Calculator as NewOpt } from '@/components/CalculatorOptions/Calculator';
import { Products } from '@/components/Partner';
import { UnsavedChangesProvider } from '@/components/unsavedChanges';

export default function Page() {
  return (
    <div>
      <UnsavedChangesProvider>
        <CalculatorMerged />
      </UnsavedChangesProvider>
      <Products />
    </div>
  );
}
