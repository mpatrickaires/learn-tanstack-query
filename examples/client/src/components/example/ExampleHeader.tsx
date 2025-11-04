import { Box } from '@mui/material';
import { type ComponentProps, type PropsWithChildren } from 'react';
import { ExampleDescription } from './ExampleDescription';
import { ExampleRun } from './ExampleRun';
import { ExampleTitle } from './ExampleTitle';

export function ExampleHeader({
  description,
  docsUrl,
  children,
  ...props
}: Props) {
  return (
    <Box>
      <ExampleTitle docsUrl={docsUrl} />
      <ExampleDescription description={description} />
      <ExampleRun {...props}>{children}</ExampleRun>
    </Box>
  );
}

type Props = PropsWithChildren<{
  description: string;
  docsUrl: string;
}> &
  Pick<ComponentProps<typeof ExampleRun>, 'autoRun'>;
