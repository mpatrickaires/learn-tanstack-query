import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import tanStackQueryLogo from '/tanstack-query-logo.png';
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

const theme = createTheme({
  palette: { mode: 'dark' },
  typography: { fontSize: 16 },
});

const drawerWidth = 200;

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex">
        <AppBar
          position="fixed"
          sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Box display="flex" gap={2}>
              <img src={tanStackQueryLogo} width={32} />
              <Typography variant="h6" noWrap component="div">
                TanStack Query Examples
              </Typography>
            </Box>
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
                <ListItemButton>
                  <ListItemText>Item 1</ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" flexGrow={1} p={3}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
      <TanStackRouterDevtools />
    </ThemeProvider>
  ),
});
