import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { buildApi } from '../api';
import { ExampleContainer } from '../components/ExampleContainer';
import { useElapsedTime } from '../hooks/useElapsedTime';

const api = buildApi('/parallel-queries-manual');

export const Route = createFileRoute('/parallel-queries-manual')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleContainer
      description='Each "name" endpoint takes approximately 1 second to return the
          response. Since the queries run in parallel, the total time will be 1
          second instead of 3 seconds (useQuery).'
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/parallel-queries#manual-parallel-queries"
    >
      <Example />
    </ExampleContainer>
  );
}

function Example() {
  const key = useMemo(() => Math.random(), []);

  const { data: userName, isSuccess: isUserNameSuccess } = useQuery({
    queryKey: ['user-name', key],
    queryFn: () => api.get<string>('user-name').then(r => r.data),
  });

  const { data: teamName, isSuccess: isTeamNameSuccess } = useQuery({
    queryKey: ['team-name', key],
    queryFn: () => api.get<string>('team-name').then(r => r.data),
  });

  const { data: projectName, isSuccess: isProjectNameSuccess } = useQuery({
    queryKey: ['project-name', key],
    queryFn: () => api.get<string>('project-name').then(r => r.data),
  });

  const isSuccess =
    isUserNameSuccess && isTeamNameSuccess && isProjectNameSuccess;

  const { elapsedTimeInSeconds } = useElapsedTime({ clearOn: isSuccess });

  return (
    <Box>
      <Typography>{elapsedTimeInSeconds}</Typography>
      {isSuccess && (
        <>
          <Typography>User name: {userName}</Typography>
          <Typography>Team name: {teamName}</Typography>
          <Typography>Project name: {projectName}</Typography>
        </>
      )}
    </Box>
  );
}
