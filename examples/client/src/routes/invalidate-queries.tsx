import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { buildApi } from '../api';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { ExampleSections } from '../components/example/ExampleSections';
import { useExampleKey } from '../hooks/useExampleKey';

const api = buildApi('/invalidate-queries');

export const Route = createFileRoute('/invalidate-queries')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description="Invalidating a query will mark it as stale. Active queries (being rendered) will be refetched immediately, whereas inactive queries (not being rendered) will be marked as stale and refetched on next component mount.
      
      In the example below, if you click on 'Invalidate query', it will refetch the queries of rendered components. But, if you toggle the switch to hide Component B and invalidate the query, the cache of the query from Component B will just be marked as stale, but will be refetched only when Component B is rendered again (by hitting the switch again)."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation"
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const queryClient = useQueryClient();
  const [showComponentB, setShowComponentB] = useState(true);

  useEffect(() => {
    // Clear cache manually on unmount because the gcTime is Infinity
    return () => {
      queryClient.removeQueries();
    };
  }, []);

  return (
    <>
      <FormControlLabel
        onChange={(_, checked) => {
          setShowComponentB(checked);
        }}
        checked={showComponentB}
        control={<Switch />}
        label="Show Component B"
        sx={{ display: 'block' }}
      />
      <Button
        onClick={() => {
          queryClient
            .invalidateQueries({
              queryKey: ['invalidateQueries'],
            })
            .catch(console.error);
        }}
      >
        Invalidate Queries
      </Button>
      <ExampleSections
        sections={[
          {
            title: 'Component A',
            render: <Component name="componentA" />,
          },
          {
            title: 'Component B',
            render: <Component name="componentB" />,
            show: showComponentB,
          },
        ]}
      />
    </>
  );
}

function Component({ name }: { name: string }) {
  const exampleKey = useExampleKey();

  const { data, isFetching } = useQuery({
    queryKey: ['invalidateQueries', name, exampleKey],
    queryFn: () => api.get<string>('/').then(r => r.data),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return (
    <Box>
      <Typography visibility={isFetching ? 'visible' : 'hidden'}>
        fetching...
      </Typography>
      {data && <Typography>{data}</Typography>}
    </Box>
  );
}
