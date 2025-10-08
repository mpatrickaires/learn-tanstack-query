import { Box, Button, Typography } from '@mui/material';
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { buildApi } from '../api';
import { TabExampleContainer } from '../components/example/TabExampleContainer';
import { VerticalSeparator } from '../components/VerticalSeparator';
import { useExampleKey } from '../contexts/exampleKeyContext';
import { useOnScroll } from '../hooks/useOnScroll';

const api = buildApi('/infinite-queries');

export const Route = createFileRoute('/infinite-queries')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <TabExampleContainer
      tabs={[
        {
          label: 'Cancel Refetch',
          description:
            "`cancelRefetch` has a default value of `true`. Setting it to `false` prevents a `fetchNextPage` call to trigger a fetch while another is going in the background. In the examples below, if you repeatedly scroll up and down at the bottom, many ongoing refetch can happen in the example 'cancelRefetch = true' whereas only one happen in the 'cancelRefetch = false' (you can also check this by opening the Network tab of DevTools).",
          component: <CancelRefetchExample />,
        },
        {
          label: 'Sequential Refetch',
          description:
            'A stale infinite query will refetch sequentially, starting from the first page. In the example below, only 3 pages are fetched, and once the query becomes stale (immediately by default), when a refetch is triggered the pages will be refetched sequentially, as can be seen by the indicator and in the Network tab of DevTools.',
          component: <SequentialRefetchExample />,
        },
        {
          label: 'Max Pages',
          description: `By passing \`maxPages\`, the query data will be limited to the given value, removing the smallest page number. 
          For the following example, the \`maxPages\` is 3, which means that when reaching page 4, the page 1 will be removed, and so go on. This can be checked by scrolling up.`,
          component: <MaxPagesExample />,
        },
      ]}
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries"
    />
  );
}

function CancelRefetchExample() {
  return (
    <Box display="flex" gap={2}>
      <Box>
        <Typography variant="h6">cancelRefetch = true</Typography>
        <CancelRefetchExampleItem cancelRefetch={true} />
      </Box>
      <VerticalSeparator />
      <Box>
        <Typography variant="h6">cancelRefetch = false</Typography>
        <CancelRefetchExampleItem cancelRefetch={false} />
      </Box>
    </Box>
  );
}

function CancelRefetchExampleItem({
  cancelRefetch,
}: {
  cancelRefetch: boolean;
}) {
  const exampleKey = useExampleKey();
  const [ongoingRefetchCount, setOngoingRefetchCount] = useState(0);

  const query = useInfiniteQuery({
    queryKey: ['infiniteQuery', 'cancelRefetch', cancelRefetch, exampleKey],
    queryFn: async ({ pageParam }) => {
      setOngoingRefetchCount(v => v + 1);
      const result = await api.get<ApiData>(`/cancel-refetch/${pageParam}`);
      setOngoingRefetchCount(v => v - 1);
      return result.data;
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    },
  });

  return (
    <Box>
      <Box visibility={query.isFetchingNextPage ? 'visible' : 'hidden'}>
        <Typography>Ongoing refetch: {ongoingRefetchCount}</Typography>
      </Box>
      <InfiniteScroll query={query} cancelRefetch={cancelRefetch} />
    </Box>
  );
}

function SequentialRefetchExample() {
  const exampleKey = useExampleKey();
  const [fetchingPageNumber, setFetchingPageNumber] = useState(1);

  const {
    data,
    isSuccess,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['infiniteQuery', 'refetch', exampleKey],
    queryFn: async ({ pageParam }) => {
      setFetchingPageNumber(pageParam);

      const result = await api.get<ApiData>(`/sequential-refetch/${pageParam}`);
      return result.data;
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.page + 1;
    },
  });

  useEffect(() => {
    if (!isFetchingNextPage && data && data?.pages.length < 3) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, data, fetchNextPage]);

  if (!isSuccess) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Button
        onClick={() => {
          if (!isFetching) {
            refetch();
          }
        }}
      >
        Refetch
      </Button>
      <Typography visibility={isFetching ? 'visible' : 'hidden'}>
        Fetching Page {fetchingPageNumber}
      </Typography>
      <Box display="flex" gap={2}>
        {data.pages.map(({ page, result }) => (
          <Box display="flex" gap={2} key={`page-${page}`}>
            <Box>
              <Typography>Page {page}</Typography>
              {result.map(item => (
                <Typography key={item}>- {item}</Typography>
              ))}
            </Box>
            {page < data.pages.length && <VerticalSeparator />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function MaxPagesExample() {
  const exampleKey = useExampleKey();

  const query = useInfiniteQuery({
    queryKey: ['infiniteQueries', 'maxPages', exampleKey],
    queryFn: ({ pageParam }) =>
      api.get(`/max-pages/${pageParam}`).then(r => r.data),
    maxPages: 3,
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    },
  });

  return <InfiniteScroll query={query} cancelRefetch={false} />;
}

function InfiniteScroll({
  query: { fetchNextPage, data, isFetchingNextPage, isLoading },
  cancelRefetch,
}: {
  query: UseInfiniteQueryResult<InfiniteData<ApiData, unknown>>;
  cancelRefetch: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useOnScroll({
    offsetBottom: 10,
    ref,
    onReachBottom: () => fetchNextPage({ cancelRefetch }),
  });

  return (
    <Box>
      <Box visibility={isFetchingNextPage ? 'visible' : 'hidden'}>
        <Typography>Fetching next page...</Typography>
      </Box>
      <Box
        maxHeight={120}
        width={400}
        overflow="auto"
        padding={2}
        border="1px dashed darkseagreen"
        ref={ref}
      >
        {data?.pages.map(({ page, result }) => (
          <Box key={`page-${page}`}>
            <Typography fontWeight={500}>Page {page}</Typography>
            {result.map(item => (
              <Typography>- {item}</Typography>
            ))}
          </Box>
        ))}
        <Typography textAlign="center">
          {isLoading ? 'Initial loading...' : '. . .'}
        </Typography>
      </Box>
    </Box>
  );
}

type ApiData = {
  page: number;
  result: string[];
};
