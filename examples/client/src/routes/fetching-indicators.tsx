import { createFileRoute } from '@tanstack/react-router';
import { buildApi } from '../api';
import { useQuery } from '@tanstack/react-query';
import { useExampleKey } from '../contexts/exampleKeyContext';
import { Button, Typography } from '@mui/material';
import { ExampleHeader } from '../components/example/ExampleHeader';

const api = buildApi('/background-fetching-indicators');

export const Route = createFileRoute('/fetching-indicators')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description={`'isPending' shows only in the initial hard-loading state of a query, i.e., when there's no data in the query cache. 'isFetching' shows when the query is being fetched in the background. 'isLoading' shows when both 'isPending' and 'isFetching' are true. 
      With that in mind, we can observe below that 'isPending' will show only when the button 'Run' is clicked, because it starts the query anew without any data in the cache, by consequence a fetching will be performed and 'isFetching' will show as well, which makes both true and thus shows 'isLoading'. Now, since the query has data, when a refetch is triggered manually by clicking on 'Refetch', or automatically by changing tabs or minimizing the window, it will perform only a background refetch, displaying only 'isFetching'.`}
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/background-fetching-indicators"
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const exampleKey = useExampleKey();

  const { data, isPending, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['backgroundFetchingIndicators', exampleKey],
    queryFn: () => api.get<string>('/').then(r => r.data),
  });

  return (
    <>
      <Button onClick={() => refetch()} variant="outlined">
        Refetch
      </Button>
      <Typography visibility={isPending ? 'visible' : 'hidden'}>
        isPending...
      </Typography>
      <Typography visibility={isFetching ? 'visible' : 'hidden'}>
        isFetching...
      </Typography>
      <Typography visibility={isLoading ? 'visible' : 'hidden'}>
        isLoading...
      </Typography>
      <Typography>{data}</Typography>
    </>
  );
}
