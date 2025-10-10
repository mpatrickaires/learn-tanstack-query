import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { buildApi } from '../api';
import { Box, Typography } from '@mui/material';
import { useElapsedTime } from '../hooks/useElapsedTime';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { useExampleKey } from '../contexts/exampleKeyContext';
import { useEffect, useState } from 'react';

const api = buildApi('/deduping');

export const Route = createFileRoute('/deduping')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description="There are three components that call the same endpoint. Since they are using exactly the same query key for their calls, the request gets deduped, which means that instead of three requests being sent, only one is sent. Even though the delayed component starts 500ms later, the request is still going, so it will also get deduped (which you can observe by the response for it taking only ~500ms, because the request is already in progress)."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/overview#motivation"
    >
      <>
        <ExampleFirstComponent />
        <hr />
        <ExampleSecondComponent />
        <hr />
        <ExampleDelayedComponent />
      </>
    </ExampleHeader>
  );
}

function useDedupingQuery(
  { enabled }: { enabled?: boolean } = { enabled: true }
) {
  const exampleKey = useExampleKey();

  return useQuery({
    queryKey: ['deduping', exampleKey],
    queryFn: () => api.get<string>('/').then(r => r.data),
    enabled,
  });
}

function ExampleFirstComponent() {
  const { data, isSuccess } = useDedupingQuery();

  const { elapsedTimeInSeconds } = useElapsedTime({ clearOn: isSuccess });

  return (
    <Box>
      <Typography variant="h4">First component</Typography>
      <Typography>{elapsedTimeInSeconds}</Typography>
      <Typography>{isSuccess ? data : 'Waiting response...'}</Typography>
    </Box>
  );
}

function ExampleSecondComponent() {
  const { data, isSuccess } = useDedupingQuery();

  const { elapsedTimeInSeconds } = useElapsedTime({ clearOn: isSuccess });

  return (
    <Box>
      <Typography variant="h4">Second component</Typography>
      <Typography>{elapsedTimeInSeconds}</Typography>
      <Typography>{isSuccess ? data : 'Waiting response...'}</Typography>
    </Box>
  );
}

function ExampleDelayedComponent() {
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const exampleKey = useExampleKey();
  const { data, isSuccess } = useDedupingQuery({ enabled: isQueryEnabled });
  const { elapsedTimeInSeconds } = useElapsedTime({
    clearOn: isSuccess,
    enabled: isQueryEnabled,
  });

  useEffect(() => {
    setTimeout(() => setIsQueryEnabled(true), 500);
  }, [exampleKey]);

  return (
    <Box>
      <Typography variant="h4">Delayed component</Typography>
      <Typography>Is query enabled: {isQueryEnabled.toString()}</Typography>
      <Typography>{elapsedTimeInSeconds}</Typography>
      <Typography>{isSuccess ? data : 'Waiting response...'}</Typography>
    </Box>
  );
}
