import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, TextField, Typography } from '@mui/material';
import {
  queryOptions,
  useQuery,
  useQueryClient,
  type DefinedUseQueryResult,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { buildApi } from '../api';
import { ExampleHeaderTab } from '../components/example/ExampleHeaderTab';
import { ExampleSections } from '../components/example/ExampleSections';
import { useExampleKey } from '../hooks/useExampleKey';
import { useElapsedTime } from '../hooks/useElapsedTime';
import {
  formatTime,
  getDateAtSecondsAgo,
  getTime,
  msToSeconds,
  secondsToMs,
} from '../utils';

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
        {
          label: 'Initial Data from Cache',
          description:
            'The initial data can also be obtained from the cache of another query. In the example below, the items of ID 1, 2 and 3 are already loaded in the items query, so if you search their ID, the single item query will fetch them directly from the items query, while for other IDs it will have to fetch from the API (displaying a loader).',
          render: <InitialDataFromCacheExample />,
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

function InitialDataFromCacheExample() {
  const exampleKey = useExampleKey();

  const { data: items } = useQuery(
    initialDataFromCacheQueryOptions(exampleKey)
  );

  const [fieldValue, setFieldValue] = useState<number | ''>('');
  const [queryId, setQueryId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const {
    data: singleItem,
    isLoading: isLoadingSingleItem,
    isSuccess: isSuccessSingleItem,
  } = useQuery({
    queryKey: ['initialQueryData', 'initialDataFromCache', queryId, exampleKey],
    queryFn: () => {
      const cacheItem = queryClient
        .getQueryData(initialDataFromCacheQueryOptions(exampleKey).queryKey)
        ?.find(item => item.id === queryId);
      if (cacheItem) {
        return cacheItem;
      }

      return api
        .get<InitialDataFromCacheResponse>(
          `/initial-data-from-cache/${queryId}`
        )
        .then(r => r.data);
    },
    enabled: !!queryId,
  });

  return (
    <Box>
      <Box>
        <Typography variant="h6">Items query:</Typography>
        {items?.map(({ label }) => (
          <Typography key={label}>- {label}</Typography>
        ))}
      </Box>
      <hr />
      <Box mt={1}>
        <Typography variant="h6">Single item query:</Typography>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (fieldValue) {
              setQueryId(fieldValue);
            }
          }}
        >
          <TextField
            label="Item ID"
            value={fieldValue}
            onChange={e => {
              const value = e.target.value.trim();
              if (!value) {
                setFieldValue('');
                return;
              }

              const number = Number(value);
              if (isNaN(number)) {
                setFieldValue('');
                return;
              }

              setFieldValue(number);
            }}
            disabled={isLoadingSingleItem}
            size="small"
          />
          <Button loading={isLoadingSingleItem} type="submit" size="small">
            <SearchIcon />
          </Button>
        </form>
        <Box>
          {isSuccessSingleItem && (
            <>
              <Typography>ID: {singleItem.id}</Typography>
              <Typography>Label: {singleItem.label}</Typography>
              <Typography>Description: {singleItem.description}</Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function DataDisplay({
  query: { data, isFetching, isStale, isPending, dataUpdatedAt },
  staleTime,
}: {
  query: DefinedUseQueryResult<string>;
  staleTime?: number;
}) {
  const { elapsedTimeInSeconds, resetElapsedTime } = useElapsedTime({
    clearOn: isStale,
    enabled: staleTime !== undefined,
    showMs: false,
  });

  useEffect(() => {
    resetElapsedTime();
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

function initialDataFromCacheQueryOptions(exampleKey: number) {
  return queryOptions({
    queryKey: ['initialQueryData', 'initialDataFromCache', exampleKey],
    queryFn: () =>
      api
        .get<InitialDataFromCacheResponse[]>('/initial-data-from-cache/0')
        .then(r => r.data),
  });
}

interface InitialDataFromCacheResponse {
  id: number;
  label: string;
  description: string;
}
