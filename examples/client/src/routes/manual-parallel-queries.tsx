import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';

export const Route = createFileRoute('/manual-parallel-queries')({
  component: RouteComponent,
});

function RouteComponent() {
  const [exampleKey, setExampleKey] = useState<number | null>(null);

  return (
    <Box>
      <Box>
        <Typography>
          Each "name" endpoint takes approximately 1 second to return the
          response. Since the queries run in parallel, the total time will be 1
          second instead of 3 seconds.
        </Typography>
      </Box>
      <hr />
      <Button onClick={() => setExampleKey(Math.random())} variant="contained">
        Run
      </Button>
      {exampleKey && <Example key={exampleKey} />}
    </Box>
  );
}

function Example() {
  const key = useMemo(() => Math.random(), []);

  const { data: userName, isSuccess: isUserNameSuccess } = useQuery({
    queryKey: ['user-name', key],
    queryFn: () => api.get<string>(route('user-name')).then(r => r.data),
  });

  const { data: teamName, isSuccess: isTeamNameSuccess } = useQuery({
    queryKey: ['team-name', key],
    queryFn: () => api.get<string>(route('team-name')).then(r => r.data),
  });

  const { data: projectName, isSuccess: isProjectNameSuccess } = useQuery({
    queryKey: ['project-name', key],
    queryFn: () => api.get<string>(route('project-name')).then(r => r.data),
  });

  const isSuccess =
    isUserNameSuccess && isTeamNameSuccess && isProjectNameSuccess;

  const startedAt = useMemo(() => new Date(), []);

  const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState<number>(0);

  function setElapsedTime() {
    const elapsedTime = new Date().getTime() - startedAt.getTime();
    setElapsedTimeInSeconds(elapsedTime / 1000);
  }

  const elapsedTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!elapsedTimeIntervalRef.current) {
      elapsedTimeIntervalRef.current = setInterval(setElapsedTime, 50);
    }
  }, []);

  useEffect(() => {
    if (isSuccess && elapsedTimeIntervalRef.current) {
      clearInterval(elapsedTimeIntervalRef.current);
    }
  }, [isSuccess]);

  return (
    <Box>
      <Typography>Elapsed time: {elapsedTimeInSeconds} seconds</Typography>
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

function route(path: string) {
  return `/manual-parallel-queries/${path}`;
}
