import { createFileRoute } from '@tanstack/react-router';
import { buildApi } from '../api';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { useMutation } from '@tanstack/react-query';
import { useExampleKey } from '../hooks/useExampleKey';
import { Box, Button, Typography } from '@mui/material';
import { ExampleSections } from '../components/example/ExampleSections';
import { useElapsedTime } from '../hooks/useElapsedTime';

const api = buildApi('/mutation-scope');

export const Route = createFileRoute('/mutation-scope')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description="Mutations run in parallel by default, i.e., if you invoke `.mutate()` of the same mutation twice, it will trigger the `mutationFn` twice. However, by passing a `scope.id` with some arbitrary value, all mutations with the same `scope.id` will run in serial, starting paused if there's already a mutation for that scope in progress.
      In the example below, the endpoint takes 1s to finish the request, and the 'Mutate' button calls `.mutate()` twice. If you open your DevTools Network, you'll see two requests triggered at the same time when there's no scope, whereas with scope it will trigger the second request only after the first one is finished, that's why without scope it takes ~1s while with scope it takes ~2s."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/mutations#mutation-scopes"
    >
      <ExampleSections
        sections={[
          {
            title: 'Without Scope ID',
            render: <Example withScopeId={false} />,
          },
          {
            title: 'With Scope ID',
            render: <Example withScopeId={true} />,
          },
        ]}
      />
    </ExampleHeader>
  );
}

function Example({ withScopeId }: { withScopeId: boolean }) {
  const exampleKey = useExampleKey();

  const { mutate, reset, data, isPending } = useMutation({
    mutationKey: ['mutationScope', { withScopeId, exampleKey }],
    mutationFn: () => api.post<string>('/').then(r => r.data),
    scope: withScopeId ? { id: 'mutationScope' } : undefined,
  });

  const { elapsedTimeInSeconds, resetElapsedTime } = useElapsedTime({
    clearOn: !!data,
    enabled: isPending,
  });

  return (
    <Box>
      <Button
        onClick={() => {
          if (isPending) {
            return;
          }

          reset();
          resetElapsedTime();

          mutate();
          mutate();
        }}
        disabled={isPending}
        sx={{ display: 'block' }}
      >
        Mutate
      </Button>
      <Typography>{elapsedTimeInSeconds}</Typography>
      {data}
    </Box>
  );
}
