import { Box, Typography } from '@mui/material';
import { useQuery, type DefinedUseQueryResult } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';
import { buildApi } from '../api';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { ExampleSections } from '../components/example/ExampleSections';
import { useExampleKey } from '../contexts/exampleKeyContext';
import { getTime, secondsToMs } from '../utils';

const api = buildApi('/initial-query-data');

export const Route = createFileRoute('/initial-query-data')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description={`An initial data can be set for the query using \`initialData\`. This initial data will be persisted into the cache and returned by the query, preventing an initial hard loading since the query will already have data. 

      With a \`staleTime: 0\` it will be refetched immediately, but with some \`staleTime\` value it will be refetched only when triggered.`}
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/initial-query-data"
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const exampleKey = useExampleKey();

  const queryStaleTimeZero = useQuery({
    queryKey: ['initialQueryData', 'staleTimeZero', exampleKey],
    queryFn: () => api.get<string>('/').then(r => r.data),
    initialData: `Initial data: ${getTime()}`,
  });

  const queryStaleTimeNonZero = useQuery({
    queryKey: ['initialQueryData', 'staleTimeNonZero', exampleKey],
    queryFn: () => api.get<string>('/').then(r => r.data),
    initialData: `Initial data: ${getTime()}`,
    staleTime: secondsToMs(1),
  });

  return (
    <ExampleSections
      sections={[
        {
          title: 'staleTime: 0s',
          render: <DataDisplay query={queryStaleTimeZero} />,
        },
        {
          title: 'staleTime: 1s',
          render: <DataDisplay query={queryStaleTimeNonZero} />,
        },
      ]}
    />
  );
}

function DataDisplay({
  query: { data, isFetching, isStale, isPending },
}: {
  query: DefinedUseQueryResult<string>;
}) {
  return (
    <Box width={180}>
      <Typography>{data}</Typography>
      <QueryInfo>isFetching: {isFetching.toString()}</QueryInfo>
      <QueryInfo>isStale: {isStale.toString()}</QueryInfo>
      <QueryInfo>isPending: {isPending.toString()}</QueryInfo>
    </Box>
  );
}

function QueryInfo({ children }: PropsWithChildren) {
  return (
    <Typography fontSize={16} color="lightgray">
      {children}
    </Typography>
  );
}
