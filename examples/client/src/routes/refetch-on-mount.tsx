import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { buildApi } from '../api';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { useExampleKey } from '../hooks/useExampleKey';

const api = buildApi('/refetch-on-mount');

export const Route = createFileRoute('/refetch-on-mount')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description="The query will refetch on mount. The example below showcases that even if there's an active observer of the query (Component A), if another component that uses the same query is mounted (Component B), a refetch will be triggered."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/caching"
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const [showComponentB, setShowComponentB] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowComponentB(true);
    }, 2000);
  }, []);

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h6">Component A</Typography>
        <QueryData />
      </Box>
      {!showComponentB && <Typography>Mounting Component B...</Typography>}
      {showComponentB && (
        <Box>
          <Typography variant="h6">Component B</Typography>
          <QueryData />
        </Box>
      )}
    </Box>
  );
}

function QueryData() {
  const exampleKey = useExampleKey();

  const { data, isSuccess } = useQuery({
    queryKey: ['refetchOnMount', exampleKey],
    queryFn: () => api.get<string>('/').then(r => r.data),
  });

  return (
    <>
      <Typography>{isSuccess ? data : 'Loading...'}</Typography>
    </>
  );
}
