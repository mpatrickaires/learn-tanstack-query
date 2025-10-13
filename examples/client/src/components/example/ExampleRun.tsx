import { Box, Button } from '@mui/material';
import {
  forwardRef,
  useImperativeHandle,
  useState,
  type PropsWithChildren,
} from 'react';
import { ExampleKeyProvider } from '../../contexts/exampleKeyContext';

export const ExampleRun = forwardRef(({ children }: Props, ref) => {
  const [exampleKey, setExampleKey] = useState<number | null>(null);
  useImperativeHandle(
    ref,
    () =>
      ({
        hide: () => setExampleKey(null),
      }) satisfies ExampleRunRef
  );

  return (
    <ExampleKeyProvider exampleKey={exampleKey}>
      <Button onClick={() => setExampleKey(Math.random())} variant="contained">
        Run
      </Button>
      <hr />
      {exampleKey && <Box key={exampleKey}>{children}</Box>}
    </ExampleKeyProvider>
  );
});

type Props = PropsWithChildren;

export type ExampleRunRef = {
  hide: () => void;
};
