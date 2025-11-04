import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { buildApi } from '../api';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { useExampleKey } from '../hooks/useExampleKey';

const api = buildApi('/tracked-properties');

export const Route = createFileRoute('/tracked-properties')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description="By using a `select`, the query will only rerender if the data returned from the `select` is also changed. In the example below, only the title is returned by the `select`, and since only the description changes when you trigger the refetch, a rerender will not happen."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/render-optimizations"
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const exampleKey = useExampleKey();
  const queryKey = ['trackedProperties', exampleKey];

  /**
   * This component will be used to show how the `select` prevents unnecessary rerenders
   */
  function UseQueryComponent() {
    const [renderCount, setRenderCount] = useState(0);

    const { data, refetch } = useQuery({
      queryKey,
      queryFn: () => api.get<Response>('/').then(r => r.data),
      select: useCallback((data: Response) => data.title, []),
    });

    useEffect(() => {
      if (data) {
        setRenderCount(prev => prev + 1);
      }
    }, [data]);

    return (
      <Box>
        <Button onClick={() => refetch()}>Refetch</Button>
        <Typography>Title: {data}</Typography>
        <Typography>Render count: {renderCount}</Typography>
      </Box>
    );
  }

  /**
   * This component will be used to visualize the query data, to bring point in how even though it changed, the `UseQueryComponent` didn't rerender
   */
  function QueryDataComponent() {
    const { data } = useQuery({
      queryKey,
      queryFn: () => null,
      enabled: false,
    });

    return (
      <Typography>
        Query data: <code>{JSON.stringify(data || {})}</code>
      </Typography>
    );
  }

  return (
    <Box>
      <UseQueryComponent />
      <QueryDataComponent />
    </Box>
  );
}

type Response = { title: string; description: string };
