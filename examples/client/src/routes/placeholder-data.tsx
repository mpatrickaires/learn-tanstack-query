import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { buildApi } from '../api';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { ExampleSections } from '../components/example/ExampleSections';
import { useExampleKey } from '../contexts/exampleKeyContext';

const api = buildApi('/placeholder-data');

export const Route = createFileRoute('/placeholder-data')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ExampleHeader
      description="A placeholder data will make the query behave as if there's already data, but the data will not be persisted into the cache. In the example below, the movie list query loads only the title and release data of the movies and, when selected, these data will be used as the placeholder data of the movie details query, which will behave as if there's already data, but it is not in the cache as we can see in the section 'Movie details query data', which is another observer of the same query key and is displaying the `query.data`. To know if the data of the query is a placeholder, we can check the state `isPlaceholderData`, which is used to display the skeleton in the movie details section while the real data is being refetched.
      
      Basically, with placeholder data `isLoading` is false and `isFetching` is true."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data"
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const exampleKey = useExampleKey();
  const queryClient = useQueryClient();
  const [movieId, setMovieId] = useState<number | null>(null);

  const { data: movies } = useQuery(moviesQueryOptions(exampleKey));

  const { data: movieDetails, isPlaceholderData } = useQuery({
    ...movieDetailsQueryOptions(movieId, exampleKey),
    placeholderData: () => {
      const movie = queryClient
        .getQueryData(moviesQueryOptions(exampleKey).queryKey)
        ?.find(movie => movie.id === movieId);
      return movie
        ? ({ ...movie, director: '', synopsis: '' } satisfies Movie)
        : undefined;
    },
    enabled: movieId !== null,
  });

  const { data: movieDetailsCacheCheck } = useQuery({
    ...movieDetailsQueryOptions(movieId, exampleKey),
    enabled: false,
  });

  return (
    <Box>
      <ExampleSections
        sections={[
          {
            title: 'Movie list query',
            render: (
              <Box width={280}>
                <List>
                  {movies?.map(({ id, title, releaseDate }) => (
                    <ListItem key={title}>
                      <ListItemButton
                        selected={id === movieId}
                        onClick={() => setMovieId(id)}
                      >
                        <ListItemText primary={title} secondary={releaseDate} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ),
          },
          {
            title: 'Movie details query',
            show: !!movieDetails,
            render: (
              <>
                <MovieDetail label="Title" data={movieDetails?.title || ''} />
                <MovieDetail
                  label="Release Date"
                  data={movieDetails?.releaseDate || ''}
                />
                {isPlaceholderData ? (
                  <>
                    <Skeleton />
                    <Skeleton />
                  </>
                ) : (
                  <>
                    <MovieDetail
                      label="Director"
                      data={movieDetails?.director || ''}
                    />
                    <MovieDetail
                      label="Synopsis"
                      data={movieDetails?.synopsis || ''}
                    />
                  </>
                )}
              </>
            ),
          },
        ]}
      />
      <Typography mt={4}>
        Movie details query data:{' '}
        <code>{JSON.stringify(movieDetailsCacheCheck)}</code>
      </Typography>
    </Box>
  );
}

function MovieDetail({ label, data }: { label: string; data: string }) {
  return (
    <Typography>
      <Typography fontWeight={500} display="inline">
        {label}:{' '}
      </Typography>{' '}
      {data}
    </Typography>
  );
}

function moviesQueryOptions(exampleKey: number) {
  return queryOptions({
    queryKey: ['placeholderData', exampleKey],
    queryFn: () => api.get<MovieList>('/').then(r => r.data),
  });
}

function movieDetailsQueryOptions(movieId: number | null, exampleKey: number) {
  return queryOptions({
    queryKey: ['placeholderData', movieId, exampleKey],
    queryFn: () => api.get<Movie>(`/${movieId}`).then(r => r.data),
  });
}

type Movie = {
  id: number;
  title: string;
  releaseDate: string;
  director: string;
  synopsis: string;
};

type MovieList = Array<Pick<Movie, 'id' | 'title' | 'releaseDate'>>;
