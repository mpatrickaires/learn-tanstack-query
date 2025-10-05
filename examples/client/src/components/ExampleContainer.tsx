import { Box } from '@mui/material';
import { type PropsWithChildren } from 'react';
import { ExampleDescription } from './ExampleDescription';
import { ExampleRun } from './ExampleRun';
import { ExampleTitle } from './ExampleTitle';

export function ExampleContainer({ description, docsUrl, children }: Props) {
  return (
    <Box>
      <ExampleTitle docsUrl={docsUrl} />
      <ExampleDescription description={description} />
      <ExampleRun>{children}</ExampleRun>
    </Box>
  );
}

type Props = PropsWithChildren<{
  description: string;
  docsUrl: string;
}>;
