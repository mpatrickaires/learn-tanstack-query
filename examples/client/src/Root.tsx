import {
  AppBar,
  Box,
  createTheme,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Link, Outlet, useRouter } from '@tanstack/react-router';
import tanStackQueryLogo from '/tanstack-query-logo.png';

const theme = createTheme({
  palette: { mode: 'dark' },
  typography: { fontSize: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        a {
          text-decoration: none;
          color: inherit;
        }
      `,
    },
  },
});

const drawerWidth = 300;

const queryClient = new QueryClient({
  // To guarantee that there's no cache between example runs
  defaultOptions: { queries: { gcTime: 0 } },
});

export const Root = () => {
  const { flatRoutes } = useRouter();
  const allPaths: string[] = (flatRoutes.map(({ path }) => path) as string[])
    .filter(path => path !== '/')
    .sort();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex">
          <AppBar
            position="fixed"
            sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
          >
            <Toolbar>
              <Link to="/">
                <Box display="flex" gap={2}>
                  <img src={tanStackQueryLogo} width={38} />
                  <Typography variant="h6" noWrap component="div">
                    TanStack Query Examples
                  </Typography>
                </Box>
              </Link>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            <Toolbar />
            <Box overflow="auto">
              <List>
                {allPaths.map(path => (
                  <ListItem key={path}>
                    <Link to={path}>
                      <ListItemButton>
                        <ListItemText>
                          <Typography textTransform="capitalize">
                            {path.replaceAll('-', ' ')}
                          </Typography>
                        </ListItemText>
                      </ListItemButton>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          <Box component="main" flexGrow={1} p={3}>
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
        <ReactQueryDevtools />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
