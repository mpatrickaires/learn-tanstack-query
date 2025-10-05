import { Box, List, ListItem, Typography } from '@mui/material';
import { queryOptions, useQueries } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { buildApi } from '../api';
import { ExampleContainer } from '../components/example/ExampleContainer';
import { useElapsedTime } from '../hooks/useElapsedTime';
import { generateRandomNumbers } from '../utils';

const api = buildApi('/parallel-queries-dynamic');

export const Route = createFileRoute('/parallel-queries-dynamic')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleContainer
      description='Each "user-name" endpoint takes approximately 1 second to return the
          response. Since the queries run in parallel, the total time will be 1
          second instead of 3 seconds (useQueries).'
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/parallel-queries#dynamic-parallel-queries-with-usequeries"
    >
      <Example />
    </ExampleContainer>
  );
}

function Example() {
  const keys = useMemo(() => generateRandomNumbers({ count: 3, upTo: 50 }), []);

  const userNameQueries = useQueries({
    queries: keys.map(id =>
      queryOptions({
        queryKey: ['user', id],
        queryFn: () => api.get<string>(`${id}/user-name`).then(r => r.data),
      })
    ),
  });

  const isSuccess = userNameQueries.every(({ isSuccess }) => isSuccess);

  const { elapsedTimeInSeconds } = useElapsedTime({ clearOn: isSuccess });

  return (
    <Box>
      <Typography>{elapsedTimeInSeconds}</Typography>
      {isSuccess && (
        <List>
          <Typography fontWeight="bold">Users</Typography>
          {userNameQueries.map(({ data }) => (
            <ListItem>
              <Typography>- {data}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
