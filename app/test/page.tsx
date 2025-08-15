"use client"

import { Calculator } from "@/components/Calculator3/Calculator";
import { Calculator as Calc } from "@/components/Calculator/Calculator";
import { Calculator as CalcOpt } from "@/components/CalculatorPaymentOptions/Calculator";
import { UnsavedChangesProvider } from '@/components/unsavedChanges';
import Login from '@/components/LoginComponent';

export default function Page() {
    return(
        <UnsavedChangesProvider>
            <Login businessName="DBM" />
            <Calculator prefilled={false}/>
            <Calc/>
            <CalcOpt />
        </UnsavedChangesProvider>
    )
}