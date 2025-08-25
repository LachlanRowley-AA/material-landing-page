import { createContext, ReactNode, useState } from 'react';

// Constants
export const MAX_LOAN_AMOUNT = 500000;
export const MIN_LOAN_AMOUNT = 5000;
export const DEFAULT_INTEREST_RATE = 13.95;
export const startingAmount = 5000;

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
}

// Create context with defaults
export const CalculatorContext = createContext<CalculatorContextProps>({
  startingAmount,
  baseValue: 0,
  isMobile: false,
  minLoanAmount: MIN_LOAN_AMOUNT,
  maxLoanAmount: MAX_LOAN_AMOUNT,
  defaultInterestRate: DEFAULT_INTEREST_RATE,
  setBaseValue: () => {},
  setIsMobile: () => {},
});


type CalculatorProviderProps = {
  children: ReactNode;
  startingAmount?: number;
}
export function CalculatorProvider({ children, startingAmount = 5000 }: CalculatorProviderProps) {
  const [baseValue, setBaseValue] = useState(Math.min(Math.max(MIN_LOAN_AMOUNT, startingAmount), MAX_LOAN_AMOUNT));
  const [isMobile, setIsMobile] = useState(false);

  return (
    <CalculatorContext.Provider
      value={{
        startingAmount,
        baseValue,
        setBaseValue,
        isMobile,
        setIsMobile,
        minLoanAmount: MIN_LOAN_AMOUNT,
        maxLoanAmount: MAX_LOAN_AMOUNT,
        defaultInterestRate: DEFAULT_INTEREST_RATE,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}
