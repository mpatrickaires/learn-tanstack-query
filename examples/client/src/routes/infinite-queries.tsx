import { Box, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';
import { buildApi } from '../api';
import { ExampleContainer } from '../components/ExampleContainer';
import { useExampleKey } from '../contexts/exampleKeyContext';
import { useOnScroll } from '../hooks/useOnScroll';

const api = buildApi('/infinite-queries');

export const Route = createFileRoute('/infinite-queries')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleContainer
      description="An infinite scroll using the more appropriate API for that (`useInfiniteQuery`). Scrolling the container below will keep loading more items. The `data` of `useInfiniteQuery` is a custom value returned by the library and has the data inside a field `pages`, which separates the returned API data by each page it belongs to."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries"
    >
      <Example />
    </ExampleContainer>
  );
}

function Example() {
  const exampleKey = useExampleKey();

  const { data, isLoading, isSuccess, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['infiniteQuery', exampleKey],
      queryFn: async ({ pageParam }) => {
        const result = await api.get<string[]>(`/${pageParam}`);
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
    onReachBottom: () => fetchNextPage({ cancelRefetch: false }),
    offsetBottom: 150,
  });

  return (
    <>
      <Typography visibility={isFetchingNextPage ? 'visible' : 'hidden'}>
        Fetching next page...
      </Typography>
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
    </>
  );
}
