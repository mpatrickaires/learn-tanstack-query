import { createFileRoute } from '@tanstack/react-router';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { buildApi } from '../api';
import { useExampleKey } from '../hooks/useExampleKey';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

const api = buildApi('/invalidations-from-mutations');

export const Route = createFileRoute('/invalidations-from-mutations')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description="Usually, we want a fresh data to be refetched after we change it on the server through mutation. By invalidating the respective query you need to update inside the `onSuccess` of the mutation, the fresh data will be refetched immediately, as shown in the example below. By disabling 'Invalidate on mutation', the query invalidation will not be invoked and stale data will be shown until refetched (e.g., by changing tabs).
      
      Also, by using `await` when calling the `invalidateQueries` inside the `onSuccess` of the mutation will make so that the mutation will stay pending until the refetch triggered by the invalidation is complete."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations"
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const exampleKey = useExampleKey();
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ['invalidationsFromMutations', exampleKey],
    queryFn: () => api.get<Todo>(`/${exampleKey}`).then(r => r.data),
  });

  const [isMutationComplete, setIsMutationComplete] = useState(false);
  const [invalidateOnMutation, setInvalidateOnMutation] = useState(true);
  const { mutate, status } = useMutation({
    mutationKey: ['invalidationsFromMutations', exampleKey],
    mutationFn: async (data: Todo) => {
      setIsMutationComplete(false);
      await api.post(`/${exampleKey}`, data);
    },
    onSuccess: async () => {
      setIsMutationComplete(true);
      if (invalidateOnMutation) {
        await queryClient.invalidateQueries({
          queryKey: ['invalidationsFromMutations', exampleKey],
        });
      }
    },
  });

  useEffect(() => {
    return () => {
      api.post('/clear').catch(console.error);
    };
  }, []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Box>
      <Typography variant="h5">Query</Typography>
      <Typography fontSize={14} color="lightgray">
        is fetching: {isFetching.toString()}
      </Typography>
      {data && (
        <>
          <Typography>Title: {data.title}</Typography>
          <Typography>Description: {data.description}</Typography>
        </>
      )}
      <hr />
      <Typography variant="h5">Mutation</Typography>
      <Typography>
        is mutation complete: {isMutationComplete.toString()}
      </Typography>
      <Typography mb={2}>status: {status}</Typography>
      <FormControlLabel
        onChange={(_, checked) => {
          setInvalidateOnMutation(checked);
        }}
        checked={invalidateOnMutation}
        control={<Switch />}
        label="Invalidate on mutation"
        sx={{ display: 'block' }}
      />
      <form
        onSubmit={e => {
          e.preventDefault();
          mutate({ title, description });
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} maxWidth={300}>
          <TextField
            label="Title"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
          />
          <Button type="submit">Mutate</Button>
        </Box>
      </form>
    </Box>
  );
}

interface Todo {
  title: string;
  description: string;
}
