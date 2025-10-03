import { createRootRoute } from '@tanstack/react-router';
import { Root } from '../Root';

export const Route = createRootRoute({
  component: () => <Root />,
});
