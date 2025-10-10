import { Box, Button, Typography } from '@mui/material';
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { buildApi } from '../api';
import { ExampleHeaderTab } from '../components/example/ExampleHeaderTab';
import { ExampleSections } from '../components/example/ExampleSections';
import { useExampleKey } from '../contexts/exampleKeyContext';
import { useOnScroll } from '../hooks/useOnScroll';

const api = buildApi('/infinite-queries');

export const Route = createFileRoute('/infinite-queries')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeaderTab
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
        {
          label: 'Fetch Previous Page',
          description:
            "With `maxPage` set, passing a value to `getPreviousPageParam` can be used to tell if there's a previous page and fetch it if the user scrolls to the top, as can be done in the example below, where `maxPages` is 3.",
          component: <FetchPreviousPageExample />,
        },
      ]}
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries"
    />
  );
}

function CancelRefetchExample() {
  return (
    <ExampleSections
      sections={[
        {
          title: 'cancelRefetch = true',
          render: <CancelRefetchExampleItem cancelRefetch={true} />,
        },
        {
          title: 'cancelRefetch = false',
          render: <CancelRefetchExampleItem cancelRefetch={false} />,
        },
      ]}
      titleProps={{ mb: -4 }}
    />
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
      <ExampleSections
        sections={data.pages.map(({ page, result }) => ({
          render: (
            <Box display="flex" gap={2} key={`page-${page}`}>
              <Box>
                <Typography>Page {page}</Typography>
                {result.map(item => (
                  <Typography key={item}>- {item}</Typography>
                ))}
              </Box>
            </Box>
          ),
        }))}
      />
    </Box>
  );
}

function MaxPagesExample() {
  const exampleKey = useExampleKey();

  const query = useInfiniteQuery({
    queryKey: ['infiniteQueries', 'maxPages', exampleKey],
    queryFn: ({ pageParam }) =>
      api.get<ApiData>(`/max-pages/${pageParam}`).then(r => r.data),
    maxPages: 3,
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    },
  });

  return <InfiniteScroll query={query} cancelRefetch={false} />;
}

function FetchPreviousPageExample() {
  const exampleKey = useExampleKey();

  const query = useInfiniteQuery({
    queryKey: ['infiniteQueries', 'fetchPreviousPage', exampleKey],
    queryFn: ({ pageParam }) =>
      api.get<ApiData>(`/fetch-previous-page/${pageParam}`).then(r => r.data),
    maxPages: 3,
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
      lastPageParam + 1,
    getPreviousPageParam: firstPage => {
      if (firstPage.page === 1) {
        return undefined;
      }
      return firstPage.page - 1;
    },
  });

  return <InfiniteScroll query={query} cancelRefetch={false} />;
}

function InfiniteScroll({
  query: {
    fetchNextPage,
    data,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
    hasPreviousPage,
    fetchPreviousPage,
  },
  cancelRefetch,
}: {
  query: UseInfiniteQueryResult<InfiniteData<ApiData, unknown>>;
  cancelRefetch: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useOnScroll({
    ref,
    onReachBottom: () => fetchNextPage({ cancelRefetch }),
    offsetBottom: 100,
    onReachTop: () => hasPreviousPage && fetchPreviousPage({ cancelRefetch }),
    offsetTop: 200,
  });

  return (
    <Box>
      <Box
        visibility={
          isFetchingNextPage || isFetchingPreviousPage ? 'visible' : 'hidden'
        }
      >
        <Typography>
          Fetching {isFetchingNextPage ? 'next' : 'previous'} page...
        </Typography>
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
              <Typography key={item}>- {item}</Typography>
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
