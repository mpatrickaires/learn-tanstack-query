import { Box, Typography, Button } from '@mui/material';
import { useState, type PropsWithChildren } from 'react';
import { ExampleKeyProvider } from '../contexts/exampleKeyContext';

export function ExampleContainer({ description, docsUrl, children }: Props) {
  const [exampleKey, setExampleKey] = useState<number | null>(null);

  const pageName = window.location.pathname
    .replaceAll('/', '')
    .replaceAll('-', ' ');

  return (
    <ExampleKeyProvider exampleKey={exampleKey}>
      <Box>
        <Box mb={2} display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={0.5}>
            <Typography
              variant="h5"
              textTransform="capitalize"
              sx={{
                '&:hover': {
                  textDecorationLine: 'underline',
                },
              }}
              className="example-title"
            >
              <a href={docsUrl} target="_blank">
                {pageName}
              </a>
            </Typography>
          </Box>
          <Typography
            lineHeight={1.5}
            textAlign="justify"
            whiteSpace="pre-line"
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
  docsUrl: string;
}>;
