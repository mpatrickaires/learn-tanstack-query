import type { PropsWithChildren } from 'react';
import { ExampleKeyContext } from './context';

export const ExampleKeyProvider = ({
  exampleKey,
  children,
}: PropsWithChildren<{ exampleKey: number | null }>) => {
  return <ExampleKeyContext value={exampleKey}>{children}</ExampleKeyContext>;
};
