import { createContext, useContext, useState } from 'react';

type UnsavedChangesContextType = {
  unsavedChanges: boolean;
  setUnsavedChanges: (val: boolean) => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextType | null>(null);

export const UnsavedChangesProvider = ({ children }: { children: React.ReactNode }) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  return (
    <UnsavedChangesContext.Provider value={{ unsavedChanges, setUnsavedChanges }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error('useUnsavedChanges must be used within an UnsavedChangesProvider');
  }
  return context;
};
