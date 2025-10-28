import { Box, Button } from '@mui/material';
import {
  useImperativeHandle,
  useState,
  type PropsWithChildren,
  type Ref,
} from 'react';
import { ExampleKeyProvider } from '../../contexts/exampleKey/provider';

export function ExampleRun({
  ref,
  children,
}: PropsWithChildren<{ ref: Ref<unknown> }>) {
  const [exampleKey, setExampleKey] = useState<number | null>(null);
  useImperativeHandle(
    ref,
    () =>
      ({
        hide: () => {
          setExampleKey(null);
        },
      }) satisfies ExampleRunRef
  );

  return (
    <ExampleKeyProvider exampleKey={exampleKey}>
      <Button
        onClick={() => {
          setExampleKey(Math.random());
        }}
        variant="contained"
      >
        Run
      </Button>
      <hr style={{ color: '#8489c0ff' }} />
      {exampleKey && <Box key={exampleKey}>{children}</Box>}
    </ExampleKeyProvider>
  );
}

export interface ExampleRunRef {
  hide: () => void;
}
