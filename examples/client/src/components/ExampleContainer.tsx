import { Box, Typography, Button } from '@mui/material';
import { useState, type PropsWithChildren } from 'react';
import { ExampleKeyProvider } from '../contexts/exampleKeyContext';

export function ExampleContainer({ description, children }: Props) {
  const [exampleKey, setExampleKey] = useState<number | null>(null);

  return (
    <ExampleKeyProvider exampleKey={exampleKey}>
      <Box>
        <Box>
          <Typography
            lineHeight={1.5}
            textAlign="justify"
            whiteSpace="pre-line"
            mb={2}
          >
            {description}
          </Typography>
        </Box>
        <Button
          onClick={() => setExampleKey(Math.random())}
          variant="contained"
        >
          Run
        </Button>
        <hr />
        {exampleKey && <Box key={exampleKey}>{children}</Box>}
      </Box>
    </ExampleKeyProvider>
  );
}

type Props = PropsWithChildren<{
  description: string;
}>;
