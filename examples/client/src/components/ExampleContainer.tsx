import { Box, Typography, Button } from '@mui/material';
import { useState, type PropsWithChildren } from 'react';
import { ExampleKeyProvider } from '../contexts/exampleKeyContext';

export function ExampleContainer({ description, children }: Props) {
  const [exampleKey, setExampleKey] = useState<number | null>(null);

  return (
    <ExampleKeyProvider exampleKey={exampleKey}>
      <Box>
        <Box>
          <Typography>{description}</Typography>
        </Box>
        <hr />
        <Button
          onClick={() => setExampleKey(Math.random())}
          variant="contained"
        >
          Run
        </Button>
        {exampleKey && <Box key={exampleKey}>{children}</Box>}
      </Box>
    </ExampleKeyProvider>
  );
}

type Props = PropsWithChildren<{
  description: string;
}>;
