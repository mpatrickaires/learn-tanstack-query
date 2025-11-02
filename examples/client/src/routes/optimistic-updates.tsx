import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { buildApi } from '../api';
import { ExampleHeaderTab } from '../components/example/ExampleHeaderTab';
import { useExampleKey } from '../hooks/useExampleKey';
import ReplayIcon from '@mui/icons-material/Replay';

const api = buildApi('/optimistic-updates');

export const Route = createFileRoute('/optimistic-updates')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeaderTab
      tabs={[
        {
          label: 'Via the UI',
          description: `By using the data sent through the mutation, you can optimistically update by showing the data before even knowing if the mutation was successful and without having to wait for the server to return it. In the example below, while the mutation is pending, a light gray item will be shown in the list after being added, which means it was updated optimistically, and will be shown normally after being fetched by the query (observe the "mutation status" and "fetch status").
          
          You can also handle error status, such as if you toggle "Mutation return error", the API will return an error for the mutation and the data will be shown as red and with a "Retry" button, which can be used to retry the mutation on the optimistically updated data (do untoggle the "Mutation return error" for it to work)`,
          render: <ExampleViaTheUI />,
        },
        {
          label: 'useMutationState',
          description:
            'This is the same principle of the "Via the UI" example, but is done using `useMutationState` for when there query and mutation components are different, which don\'t allow for the usage of the `variables` directly for `useMutation`.',
          render: <ExampleUseMutationState />,
        },
        {
          label: 'Via the cache',
          description: `This is the same principle of the "Via the UI" example, but is done by directly altering the cache with the \`variables\` of the mutation inside the \`onMutate\` callback (which runs before the \`mutate\` function) and returning from it the value of the cache from before the optimistic update. The value returned from \`onMutate\` can be used on both \`onError\` and \`onSettled\` handlers of the \`useMutate\`, which allows us to fallback the cache data to the state before the optimistic update (returned from \`onMutate\`).
            
            A drawback from this usage is that we can't know if the data in the cache is from a optimistic update, and thus can't render it differently like in the "Via the UI" example (where it's light gray).`,
          render: <ExampleViaTheCache />,
        },
      ]}
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates"
    />
  );
}

function ExampleViaTheUI() {
  const exampleKey = useExampleKey();
  const [title, setTitle] = useState('');
  const [returnError, setReturnError] = useState(false);

  const queryMutationKey = ['optimisticUpdates', 'viaTheUI', exampleKey];

  const { data, refetch, fetchStatus } = useQuery({
    queryKey: queryMutationKey,
    queryFn: () => api.get<string[]>('/').then(r => r.data),
  });

  const {
    mutate,
    variables,
    status: mutationStatus,
  } = useMutation({
    mutationKey: queryMutationKey,
    mutationFn: ({
      returnError,
      ...data
    }: {
      title: string;
      returnError: boolean;
    }) => api.post(`?returnError=${returnError}`, data),
    onSuccess: async () => {
      await refetch();
    },
  });

  useEffect(() => {
    api.post('/clear').catch(console.error);
    return () => {
      api.post('/clear').catch(console.error);
    };
  }, []);

  return (
    <Box>
      <FormControlLabel
        onChange={(_, checked) => {
          setReturnError(checked);
        }}
        checked={returnError}
        control={<Switch />}
        label="Mutation return error"
        disabled={mutationStatus === 'pending'}
      />
      <Typography fontSize={16} color="lightgray">
        mutation status: {mutationStatus}
      </Typography>
      <Typography fontSize={16} color="lightgray">
        fetch status: {fetchStatus}
      </Typography>
      {data?.map(todo => (
        <Typography key={todo}>- {todo}</Typography>
      ))}
      {mutationStatus === 'pending' && (
        <Typography sx={{ opacity: 0.5 }}>- {variables.title}</Typography>
      )}
      {mutationStatus === 'error' && (
        <Box display="flex" gap={1}>
          <Typography sx={{ color: 'red' }}>- {variables.title}</Typography>
          <Button
            onClick={() => {
              mutate({ ...variables, returnError });
            }}
            startIcon={<ReplayIcon fontSize="small" />}
          >
            Retry
          </Button>
        </Box>
      )}
      <hr />
      <form
        onSubmit={e => {
          e.preventDefault();
          if (title.trim() && mutationStatus !== 'pending') {
            mutate({ title, returnError });
            setTitle('');
          }
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} maxWidth={250}>
          <TextField
            label="Title"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
            disabled={mutationStatus === 'pending'}
            sx={{ flexGrow: 1 }}
          />
          <Button
            type="submit"
            loading={mutationStatus === 'pending'}
            sx={{ flexGrow: 1 }}
          >
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
}

function ExampleUseMutationState() {
  const exampleKey = useExampleKey();

  const queryMutationKey = [
    'optimisticUpdates',
    'useMutationState',
    exampleKey,
  ];

  useEffect(() => {
    api.post('/clear').catch(console.error);
    return () => {
      api.post('/clear').catch(console.error);
    };
  }, []);

  function QueryComponent() {
    const { data, fetchStatus } = useQuery({
      queryKey: queryMutationKey,
      queryFn: () => api.get<string[]>('/').then(r => r.data),
    });

    // useMutationState return an array of mutations that match the filter
    const mutation = useMutationState({
      filters: { mutationKey: queryMutationKey, status: 'pending' },
    })[0];

    return (
      <Box>
        <Typography fontSize={16} color="lightgray">
          mutation ongoing: {Boolean(mutation).toString()}
        </Typography>
        <Typography fontSize={16} color="lightgray">
          fetch status: {fetchStatus}
        </Typography>
        {data?.map(todo => (
          <Typography key={todo}>- {todo}</Typography>
        ))}
        {mutation && (
          <Typography sx={{ opacity: 0.5 }}>
            - {(mutation.variables as { title: string }).title}
          </Typography>
        )}
      </Box>
    );
  }

  function MutationComponent() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');

    const { isPending, mutate } = useMutation({
      mutationKey: queryMutationKey,
      mutationFn: (variables: { title: string }) => api.post('/', variables),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: queryMutationKey });
      },
    });

    return (
      <Box>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (title.trim() && !isPending) {
              mutate({ title });
              setTitle('');
            }
          }}
        >
          <Box display="flex" flexDirection="column" gap={2} maxWidth={250}>
            <TextField
              label="Title"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
              disabled={isPending}
              sx={{ flexGrow: 1 }}
            />
            <Button type="submit" loading={isPending} sx={{ flexGrow: 1 }}>
              Add
            </Button>
          </Box>
        </form>
      </Box>
    );
  }

  return (
    <Box>
      <QueryComponent />
      <hr />
      <MutationComponent />
    </Box>
  );
}

function ExampleViaTheCache() {
  const exampleKey = useExampleKey();
  const queryMutationKey = ['optimisticUpdates', 'viaTheCache', exampleKey];

  function QueryComponent() {
    const { data, fetchStatus } = useQuery({
      queryKey: queryMutationKey,
      queryFn: () => api.get<string[]>('/').then(r => r.data),
    });

    return (
      <Box>
        <Typography fontSize={16} color="lightgray">
          fetch status: {fetchStatus}
        </Typography>
        {data?.map(todo => (
          <Typography key={todo}>- {todo}</Typography>
        ))}
      </Box>
    );
  }

  function MutationComponent() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [returnError, setReturnError] = useState(false);

    const { isPending, mutate } = useMutation({
      mutationKey: queryMutationKey,
      mutationFn: (variables: { title: string }) =>
        api.post(`?returnError=${returnError}`, variables),
      onMutate: async newData => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: queryMutationKey });

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(queryMutationKey);

        // Optimistically update to the new value
        queryClient.setQueryData(queryMutationKey, (old: string) => [
          ...old,
          newData.title,
        ]);

        // Return a result with a snapshotted value
        return { previousData };
      },
      // If the mutation fails, use the result returned from onMutate to roll back
      onError: (_err, _newData, onMutateResult) => {
        queryClient.setQueryData(
          queryMutationKey,
          onMutateResult?.previousData
        );
      },
      // Always refetch after error or success
      onSettled: (_data, _error, _variables, _onMutateResult) => {
        queryClient.invalidateQueries({ queryKey: queryMutationKey });
      },
    });

    return (
      <Box>
        <FormControlLabel
          onChange={(_, checked) => {
            setReturnError(checked);
          }}
          checked={returnError}
          control={<Switch />}
          label="Mutation return error"
          disabled={isPending}
        />
        <form
          onSubmit={e => {
            e.preventDefault();
            if (title.trim() && !isPending) {
              mutate({ title });
              setTitle('');
            }
          }}
        >
          <Box display="flex" flexDirection="column" gap={2} maxWidth={250}>
            <TextField
              label="Title"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
              disabled={isPending}
              sx={{ flexGrow: 1 }}
            />
            <Button type="submit" loading={isPending} sx={{ flexGrow: 1 }}>
              Add
            </Button>
          </Box>
        </form>
      </Box>
    );
  }

  return (
    <Box>
      <QueryComponent />
      <hr />
      <MutationComponent />
    </Box>
  );
}
