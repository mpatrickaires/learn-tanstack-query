import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
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
          description: `By using the data sent through the mutation, you can optimistically update by showing the data before even knowing if the mutation was successful and without having to wait for the server to return it. In the example below, while the mutation is pending, a light gray item will be shown in the list after being added, which means it was updated optimistically, and will be shown normally after being fetched by the query (observe the "mutation status" and "fetch status").
          
          You can also handle error status, such as if you toggle "Mutation return error", the API will return an error for the mutation and the data will be shown as red and with a "Retry" button, which can be used to retry the mutation on the optimistically updated data (do untoggle the "Mutation return error" for it to work)`,
          label: 'Via the UI',
          render: <ExampleViaTheUI />,
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

  useEffect(() => {
    api.post('/clear').catch(console.error);
    return () => {
      api.post('/clear').catch(console.error);
    };
  }, []);

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
