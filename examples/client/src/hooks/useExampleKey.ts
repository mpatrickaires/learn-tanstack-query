import { use } from 'react';
import { ExampleKeyContext } from '../contexts/exampleKey/context';

export const useExampleKey = () => {
  const ctx = use(ExampleKeyContext);
  if (!ctx) throw new Error('useExampleKey must be used within NumberProvider');
  return ctx;
};
