import { createContext, type PropsWithChildren, useContext } from 'react';

const ExampleKeyContext = createContext<number | null>(null);

export const ExampleKeyProvider = ({
  exampleKey,
  children,
}: PropsWithChildren<{ exampleKey: number | null }>) => {
  return (
    <ExampleKeyContext.Provider value={exampleKey}>
      {children}
    </ExampleKeyContext.Provider>
  );
};

export const useExampleKey = () => {
  const ctx = useContext(ExampleKeyContext);
  if (!ctx) throw new Error('useExampleKey must be used within NumberProvider');
  return ctx;
};
