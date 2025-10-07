import { Box, Button, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { buildApi } from '../api';
import { TabExampleContainer } from '../components/example/TabExampleContainer';
import { useExampleKey } from '../contexts/exampleKeyContext';
import { useOnScroll } from '../hooks/useOnScroll';
import { VerticalSeparator } from '../components/VerticalSeparator';

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
        <InfiniteScroll cancelRefetch={true} />
      </Box>
      <VerticalSeparator />
      <Box>
        <Typography variant="h6">cancelRefetch = false</Typography>
        <InfiniteScroll cancelRefetch={false} />
      </Box>
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

      const result = await api.get<string[]>(
        `/sequential-refetch/${pageParam}`
      );
      return result.data;
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
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
        {data.pages.map((page, i) => (
          <Box display="flex" gap={2} key={`page-${i}`}>
            <Box>
              <Typography>Page {i + 1}</Typography>
              {page.map(item => (
                <Typography key={item}>- {item}</Typography>
              ))}
            </Box>
            {i + 1 < data.pages.length && <VerticalSeparator />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function InfiniteScroll({ cancelRefetch }: { cancelRefetch: boolean }) {
  const exampleKey = useExampleKey();
  const [ongoingRefetchCount, setOngoingRefetchCount] = useState(0);

  const { data, isLoading, isSuccess, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['infiniteQuery', 'cancelRefetch', cancelRefetch, exampleKey],
      queryFn: async ({ pageParam }) => {
        setOngoingRefetchCount(v => v + 1);
        const result = await api.get<string[]>(`/cancel-refetch/${pageParam}`);
        setOngoingRefetchCount(v => v - 1);
        return result.data;
      },
      initialPageParam: 1,
      getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
        return lastPageParam + 1;
      },
    });

  const ref = useRef<HTMLElement | null>(null);
  useOnScroll({
    ref,
    onReachBottom: () => fetchNextPage({ cancelRefetch }),
    offsetBottom: 20,
  });

  return (
    <Box>
      <Box visibility={isFetchingNextPage ? 'visible' : 'hidden'}>
        <Typography>Fetching next page...</Typography>
        <Typography>Ongoing refetch: {ongoingRefetchCount}</Typography>
      </Box>
      <Box
        maxHeight={120}
        width={400}
        overflow="auto"
        padding={2}
        border="1px dashed darkseagreen"
        ref={ref}
      >
        {isSuccess &&
          data.pages.map((page, i) => (
            <>
              <Typography>Page {i + 1}</Typography>
              {page.map(item => (
                <Typography>- {item}</Typography>
              ))}
            </>
          ))}
        <Typography textAlign="center">
          {isLoading ? 'Initial loading...' : '. . .'}
        </Typography>
      </Box>
    </Box>
  );
}
