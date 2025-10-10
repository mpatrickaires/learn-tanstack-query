import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { buildApi } from '../api';
import { useExampleKey } from '../contexts/exampleKeyContext';
import { useState } from 'react';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { Typography } from '@mui/material';

const api = buildApi('/query-retries');

export const Route = createFileRoute('/query-retries')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description="The queries are retried 3 times by default when the query fails (query function throws an error). The retry delay, by default, is set to double with each attempt."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/query-retries"
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const exampleKey = useExampleKey();
  const [attempts, setAttempts] = useState<{ number: number; date: Date }[]>(
    []
  );
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['queryRetries', exampleKey],
    queryFn: async () => {
      setAttempts(attempts => [
        ...attempts,
        { number: attempts.length + 1, date: new Date() },
      ]);
      const response = await api.get<string>(`/${attempts.length + 1}`);
      return response.data;
    },
  });

  return (
    <>
      {attempts.map(({ number, date }) => (
        <Typography key={`attempt-${number}`}>
          Attempt {number} ({date.toISOString()})
        </Typography>
      ))}
      <Typography>Result: {isLoading ? 'Retrying...' : 'Success'}</Typography>
      <Typography>isError: {isError.toString()}</Typography>
      <Typography>{isSuccess && `Data: ${data}`}</Typography>
    </>
  );
}
