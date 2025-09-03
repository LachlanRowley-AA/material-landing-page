import { createContext, ReactNode, useEffect, useState } from 'react';

// Constants
export const MAX_LOAN_AMOUNT = 500000;
export const MIN_LOAN_AMOUNT = 5000;
export const DEFAULT_INTEREST_RATE = 13.95;
export const startingAmount = 5000;
export const calculateCustomRepayment = (
  loanAmount: number,
  interestRate: number,
  months: number
) => {
  if (loanAmount <= 0) {
    return 0;
  }

  const annualRate = interestRate / 100;
  const monthlyRate = annualRate / 12;

  if (monthlyRate === 0) {
    return loanAmount / months;
  }

  return (
    loanAmount * ((monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1))
  );
};

// Interface
export interface CalculatorContextProps {
  startingAmount: number;
  baseValue: number;
  isMobile: boolean;
  minLoanAmount: number;
  maxLoanAmount: number;
  defaultInterestRate: number;
  setBaseValue: (value: number) => void;
  setIsMobile: (value: boolean) => void;
  calculateCustomRepayment: (loanAmount: number, interestRate: number, months: number) => number;
  recommendedProject: string;
  selectedProduct : string;
  setSelectedProduct: (value: string) => void;
}

// Create context with defaults
export const CalculatorContext = createContext<CalculatorContextProps>({
  startingAmount,
  baseValue: 0,
  isMobile: false,
  minLoanAmount: MIN_LOAN_AMOUNT,
  maxLoanAmount: MAX_LOAN_AMOUNT,
  defaultInterestRate: DEFAULT_INTEREST_RATE,
  recommendedProject: '',
  selectedProduct: '',
  setSelectedProduct: () => {},
  setBaseValue: () => {},
  setIsMobile: () => {},
  calculateCustomRepayment: (loanAmount: number, interestRate: number, months: number) => {
    if (loanAmount <= 0) {
      return 0;
    }

    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;

    if (monthlyRate === 0) {
      return loanAmount / months;
    }

    return (
      loanAmount * ((monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1))
    );
  },
});

type CalculatorProviderProps = {
  children: ReactNode;
  startingAmount?: number;
};
export function CalculatorProvider({ children, startingAmount = 5000 }: CalculatorProviderProps) {
  const [baseValue, setBaseValue] = useState(
    Math.min(Math.max(MIN_LOAN_AMOUNT, startingAmount), MAX_LOAN_AMOUNT)
  );
  const [isMobile, setIsMobile] = useState(false);
  const recommendedProject = '';

  const [selectedProduct, setSelectedProduct] = useState('')

  useEffect(() => {
    sessionStorage.setItem('loanAmount', baseValue.toString());
  });

  return (
    <CalculatorContext.Provider
      value={{
        startingAmount,
        baseValue,
        setBaseValue,
        isMobile,
        setIsMobile,
        recommendedProject,
        minLoanAmount: MIN_LOAN_AMOUNT,
        maxLoanAmount: MAX_LOAN_AMOUNT,
        defaultInterestRate: DEFAULT_INTEREST_RATE,
        calculateCustomRepayment,
        selectedProduct,
        setSelectedProduct
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}
