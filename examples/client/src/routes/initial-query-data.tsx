import { Box, Typography } from '@mui/material';
import { useQuery, type DefinedUseQueryResult } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, type PropsWithChildren } from 'react';
import { buildApi } from '../api';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { ExampleSections } from '../components/example/ExampleSections';
import { useExampleKey } from '../contexts/exampleKeyContext';
import {
  formatTime,
  getDateAtSecondsAgo,
  getTime,
  msToSeconds,
  secondsToMs,
} from '../utils';
import { ExampleHeaderTab } from '../components/example/ExampleHeaderTab';
import { useElapsedTime } from '../hooks/useElapsedTime';

const api = buildApi('/initial-query-data');

export const Route = createFileRoute('/initial-query-data')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeaderTab
      tabs={[
        {
          label: 'staleTime',
          description: `An initial data can be set for the query using \`initialData\`. This initial data will be persisted into the cache and returned by the query, preventing an initial hard loading since the query will already have data.

          With a \`staleTime: 0\` it will be refetched immediately, but with some \`staleTime\` value it will be refetched only when triggered.`,
          render: <StaleTimeExample />,
        },
        {
          label: 'initialDataUpdatedAt',
          description: `You can tell how old the initial data is with \`initialDataUpdatedAt\` by passing a JS timestamp in milliseconds of when the \`initialData\` itself was last updated. In the example below, the \`initialDataUpdatedAt\` is 2 seconds ago, and with a \`staleTime\` of 5 seconds it means the data will be stale after 3 seconds, since it isn't totally fresh. Observe that further data received from the API will only become stale after 5 seconds, as expected.`,
          render: <InitialDataUpdatedAtExample />,
        },
      ]}
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/initial-query-data"
    />
  );
}

function StaleTimeExample() {
  const exampleKey = useExampleKey();

  const queryStaleTimeZero = useQuery({
    queryKey: ['initialQueryData', 'staleTimeZero', exampleKey],
    queryFn: () => api.get<string>('/staleTime').then(r => r.data),
    initialData: 'Initial data',
  });

  const queryStaleTimeNonZero = useQuery({
    queryKey: ['initialQueryData', 'staleTimeNonZero', exampleKey],
    queryFn: () => api.get<string>('/staleTime').then(r => r.data),
    initialData: 'Initial data',
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

function InitialDataUpdatedAtExample() {
  const exampleKey = useExampleKey();

  const staleTime = useMemo(() => secondsToMs(5), []);
  const query = useQuery({
    queryKey: ['initialQueryData', 'initialDataUpdatedAt', exampleKey],
    queryFn: () => api.get<string>('/initialDataUpdatedAt').then(r => r.data),
    staleTime,
    initialData: `Initial data ${getTime()}`,
    initialDataUpdatedAt: getDateAtSecondsAgo(2).getTime(),
  });

  return (
    <>
      <Typography variant="h6">staleTime: {msToSeconds(staleTime)}s</Typography>
      <DataDisplay query={query} staleTime={staleTime} />
    </>
  );
}

function DataDisplay({
  query: { data, isFetching, isStale, isPending, dataUpdatedAt },
  staleTime,
}: {
  query: DefinedUseQueryResult<string>;
  staleTime?: number;
}) {
  const { elapsedTimeInSeconds, reset } = useElapsedTime({
    clearOn: isStale,
    enabled: staleTime !== undefined,
    showMs: false,
  });

  useEffect(() => {
    reset();
  }, [data]);

  return (
    <Box width={180}>
      <Typography>{data}</Typography>
      {staleTime && (
        <>
          <QueryInfo>
            dataUpdatedAt: {formatTime(new Date(dataUpdatedAt))}
          </QueryInfo>
          <QueryInfo>Stale after: {elapsedTimeInSeconds}</QueryInfo>
          <QueryInfo>isStale: {isStale.toString()}</QueryInfo>
        </>
      )}
      {staleTime === undefined && (
        <>
          <QueryInfo>isStale: {isStale.toString()}</QueryInfo>
          <QueryInfo>isFetching: {isFetching.toString()}</QueryInfo>
          <QueryInfo>isPending: {isPending.toString()}</QueryInfo>
        </>
      )}
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
