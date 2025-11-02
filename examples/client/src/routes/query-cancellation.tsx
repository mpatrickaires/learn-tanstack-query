import { createFileRoute } from '@tanstack/react-router';
import { buildApi } from '../api';
import { ExampleHeaderTab } from '../components/example/ExampleHeaderTab';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useExampleKey } from '../hooks/useExampleKey';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const api = buildApi('/query-cancellation');

export const Route = createFileRoute('/query-cancellation')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeaderTab
      tabs={[
        {
          label: 'Cancel on unmount',
          description:
            'By default, queries that are unmounted before their promises on `queryFn` are resolved are not cancelled, and instead the data on the cache is updated once the promise resolves. However, we can change this behavior, as in the example below, where the component will be unmounted as soon as you click on "Refetch", and when mounted back after 1s the data will still be the old one from when it was mounted. You can also see the request cancelled through DevTools Network.',
          render: <ExampleCancelOnUnmount />,
        },
      ]}
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation"
    />
  );
}

function ExampleCancelOnUnmount() {
  const exampleKey = useExampleKey();
  const queryClient = useQueryClient();
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  useEffect(() => {
    if (!isComponentMounted) {
      setTimeout(() => {
        setIsComponentMounted(true);
      }, 1000);
    }
  }, [isComponentMounted]);

  useEffect(() => {
    // Clear cache manually on unmount because the gcTime is Infinity
    return () => {
      queryClient.removeQueries();
    };
  }, []);

  function QueryComponent({ onRefetch }: { onRefetch: () => void }) {
    const [isInitialData, setIsInitialData] = useState(true);

    const { data, fetchStatus, refetch } = useQuery({
      queryKey: ['queryCancellation', 'cancelOnUnmount', exampleKey],
      queryFn: async ({ signal }) => {
        const response = await api.get<string>(
          `?isInitialData=${isInitialData}`,
          { signal }
        );

        setIsInitialData(false);

        return response.data;
      },
      gcTime: Infinity,
      staleTime: Infinity,
    });

    return (
      <Box>
        <Typography>fetch status: {fetchStatus}</Typography>
        <Typography>{data}</Typography>
        <Button
          onClick={() => {
            refetch().catch(console.error);
            onRefetch();
          }}
        >
          Refetch
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5">
        {isComponentMounted ? 'Component mounted' : 'Component unmounted'}
        {isComponentMounted && (
          <QueryComponent
            onRefetch={() => {
              setIsComponentMounted(false);
            }}
          />
        )}
      </Typography>
    </Box>
  );
}
