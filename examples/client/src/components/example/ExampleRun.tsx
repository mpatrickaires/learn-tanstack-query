import { Box, Button } from '@mui/material';
import {
  useEffect,
  useImperativeHandle,
  useState,
  type PropsWithChildren,
  type Ref,
} from 'react';
import { ExampleKeyProvider } from '../../contexts/exampleKey/provider';

export function ExampleRun({
  ref,
  autoRun,
  children,
}: PropsWithChildren<{ ref?: Ref<unknown>; autoRun?: boolean }>) {
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

  useEffect(() => {
    if (autoRun) {
      setExampleKey(Math.random());
    }
  }, []);

  return (
    <ExampleKeyProvider exampleKey={exampleKey}>
      {!autoRun && (
        <Button
          onClick={() => {
            setExampleKey(Math.random());
          }}
          variant="contained"
        >
          Run
        </Button>
      )}
      <hr style={{ color: '#8489c0ff' }} />
      {exampleKey && <Box key={exampleKey}>{children}</Box>}
    </ExampleKeyProvider>
  );
}

export interface ExampleRunRef {
  hide: () => void;
}
