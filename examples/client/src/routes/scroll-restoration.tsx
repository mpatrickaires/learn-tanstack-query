import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { buildApi } from '../api';
import { ExampleHeader } from '../components/example/ExampleHeader';
import { Box, Button, List, ListItemButton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useExampleKey } from '../hooks/useExampleKey';
import { arrayWithNumbers } from '../utils';

export const Route = createFileRoute('/scroll-restoration')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): { item?: number } => {
    return {
      item: search.item ? Number(search.item) : undefined,
    };
  },
});

function RouteComponent() {
  return (
    <ExampleHeader
      description="Scroll restoration just works with TanStack Query! If you click on a item below, it will go to a new page to display it details. In the new page, if you go back to the previous page (by clicking the back button of the browser or the page), which is the list, the scroll will be restored."
      docsUrl="https://tanstack.com/query/latest/docs/framework/react/guides/scroll-restoration"
      autoRun
    >
      <Example />
    </ExampleHeader>
  );
}

function Example() {
  const { item } = Route.useSearch();

  return item ? <ItemDetails item={item} /> : <ItemList />;
}

function ItemList() {
  const exampleKey = useExampleKey();

  const { data } = useQuery({
    queryKey: ['scrollRestoration', exampleKey],
    queryFn: () => {
      const result = arrayWithNumbers(200);
      return Promise.resolve(result);
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });

  return (
    <Box>
      <List>
        {data?.map(item => (
          <Link to="/scroll-restoration" search={{ item }}>
            <ListItemButton key={item}>- Item {item}</ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
}

function ItemDetails({ item }: { item: number }) {
  const router = useRouter();

  return (
    <Box>
      <Button
        onClick={() => router.history.back()}
        startIcon={<ArrowBackIcon />}
      >
        Back
      </Button>
      <Typography variant="h5">Item {item}</Typography>
    </Box>
  );
}
