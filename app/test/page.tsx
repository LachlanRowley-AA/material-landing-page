"use client"

import { Calculator } from "@/components/Calculator3/Calculator";
import { Calculator as Calc } from "@/components/Calculator/Calculator";
import { UnsavedChangesProvider } from '@/components/unsavedChanges';
// import Login from '@/components/LoginComponent';
import { Calculator as NewOpt } from '@/components/CalculatorOptions/Calculator';
import { Calculator as CalculatorMerged } from '@/components/CalculatorMerged/Calculator';


export default function Page() {
    return(
        <UnsavedChangesProvider>
            <CalculatorMerged />
        </UnsavedChangesProvider>
    )
}