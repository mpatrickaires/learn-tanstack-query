import { Box, Button, List, ListItem, Typography } from '@mui/material';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { buildApi } from '../api';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { ExampleSections } from '../components/example/ExampleSections';
import { useExampleKey } from '../hooks/useExampleKey';
import { minutesToMs } from '../utils';

const api = buildApi('/paginated-queries');

const paginatedQueryKey = 'paginatedQueries';

function usePaginatedQuery({
  page,
  usePlaceholderData,
}: {
  page: number;
  usePlaceholderData: boolean;
}) {
  const exampleKey = useExampleKey();

  return useQuery({
    queryKey: [paginatedQueryKey, exampleKey, page],
    queryFn: () => api.get<string[]>(`/${page}`).then(r => r.data),
    // To keep cache of previous page
    gcTime: minutesToMs(10),
    placeholderData: usePlaceholderData ? keepPreviousData : undefined,
  });
}

export const Route = createFileRoute('/paginated-queries')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description={`With pagination, considering that we are passing the page number into the query key (which is the correct behavior), each page represent a new query, which makes it jump between the 'success' and 'pending' states when going to the next page, which makes a hard loading state show.
    This can be improved by using the 'placeholderData' with 'keepPreviousData' to keep the data of the previous page in the next query, which prevents the hard loading (the state is now 'success') and automatically triggers a refetch to update this data. In a nutshell, this makes the next page show the data of the current one.
    
    In another point, notice how going to a previous page triggers a refetch. This is because the stale time is zero, and by changing pages we are destroying and creating new queries, which triggers a refetch.`}
      docsUrl="https://tanstack.com/query/v5/docs/framework/react/guides/paginated-queries"
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const queryClient = useQueryClient();
  useEffect(() => {
    // Clear cache when rerunning the example
    return () => {
      queryClient.removeQueries({ queryKey: [paginatedQueryKey] });
    };
  }, []);

  const [page, setPage] = useState(1);

  const { isFetching, isPlaceholderData } = usePaginatedQuery({
    page,
    usePlaceholderData: true,
  });

  const isLoading = isFetching && isPlaceholderData;

  return (
    <>
      <Box display="flex" alignItems="center">
        <PaginationButton
          direction="before"
          setPage={setPage}
          disabled={isLoading}
        />
        <Typography fontSize={18}>{page}</Typography>
        <PaginationButton
          direction="next"
          setPage={setPage}
          disabled={isLoading}
        />
      </Box>
      <ExampleSections
        sections={[
          {
            title: 'With placeholder data',
            render: <PaginationExample usePlaceholderData={true} page={page} />,
          },
          {
            title: 'No placeholder data',
            render: (
              <PaginationExample usePlaceholderData={false} page={page} />
            ),
          },
        ]}
      />
    </>
  );
}

function PaginationExample({
  usePlaceholderData,
  page,
}: Parameters<typeof usePaginatedQuery>[0]) {
  const { data, isSuccess, isFetching } = usePaginatedQuery({
    page,
    usePlaceholderData,
  });

  return (
    <Box>
      <Typography visibility={isFetching ? 'visible' : 'hidden'}>
        isFetching...
      </Typography>
      {isSuccess ? (
        <List>
          <Typography>Result:</Typography>
          {data.map(item => (
            <ListItem key={item}>- {item}</ListItem>
          ))}
        </List>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
}

function PaginationButton({
  direction,
  setPage,
  disabled,
}: {
  direction: 'before' | 'next';
  setPage: Dispatch<SetStateAction<number>>;
  disabled: boolean;
}) {
  const symbol = direction === 'before' ? '<' : '>';

  return (
    <Button
      onClick={() => {
        setPage(old =>
          direction === 'before' ? Math.max(old - 1, 1) : old + 1
        );
      }}
      disabled={disabled}
      sx={{ width: 40, minWidth: 0 }}
    >
      {symbol}
    </Button>
  );
}
