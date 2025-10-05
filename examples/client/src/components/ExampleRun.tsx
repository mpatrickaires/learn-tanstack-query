import { Box, Button } from '@mui/material';
import { useState, type PropsWithChildren } from 'react';
import { ExampleKeyProvider } from '../contexts/exampleKeyContext';

export function ExampleRun({ children }: Props) {
  const [exampleKey, setExampleKey] = useState<number | null>(null);

  return (
    <ExampleKeyProvider exampleKey={exampleKey}>
      <Button onClick={() => setExampleKey(Math.random())} variant="contained">
        Run
      </Button>
      <hr />
      {exampleKey && <Box key={exampleKey}>{children}</Box>}
    </ExampleKeyProvider>
  );
}

type Props = PropsWithChildren;
