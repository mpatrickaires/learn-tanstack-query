import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import tanStackQueryLogo from '/tanstack-query-logo.png';
import {
  AppBar,
  Box,
  createTheme,
  CssBaseline,
  Drawer,
  GlobalStyles,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

export const Route = createRootRoute({
  component: () => (
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
                  <img src={tanStackQueryLogo} width={32} />
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
                <ListItem>
                  <Link to="/manual-parallel-queries">
                    <ListItemButton>
                      <ListItemText>Manual Parallel Queries</ListItemText>
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem>
                  <Link to="/dynamic-parallel-queries">
                    <ListItemButton>
                      <ListItemText>Dynamic Parallel Queries</ListItemText>
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem>
                  <Link to="/deduping">
                    <ListItemButton>
                      <ListItemText>Deduping</ListItemText>
                    </ListItemButton>
                  </Link>
                </ListItem>
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
  ),
});
