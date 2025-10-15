import express from 'express';
import cors from 'cors';
import { router as parallelQueriesManualRouter } from './routes/parallel-queries-manual.js';
import { router as parallelQueriesDynamicRouter } from './routes/parallel-queries-dynamic.js';
import { router as dedupingRouter } from './routes/deduping.js';
import { router as backgroundFetchingIndicator } from './routes/background-fetching-indicators.js';
import { router as queryRetries } from './routes/query-retries.js';
import { router as paginatedQueries } from './routes/paginated-queries.js';
import { router as infiniteQueries } from './routes/infinite-queries.js';
import { router as initialQueryData } from './routes/initial-query-data.js';
import { router as refetchOnMount } from './routes/refetch-on-mount.js';
import { router as placeholderData } from './routes/placeholder-data.js';

const app = express();

// Disable cache to prevent unexpected behavior on examples
app.use((req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.use(cors());

app.use('/parallel-queries-manual', parallelQueriesManualRouter);
app.use('/parallel-queries-dynamic', parallelQueriesDynamicRouter);
app.use('/deduping', dedupingRouter);
app.use('/background-fetching-indicators', backgroundFetchingIndicator);
app.use('/query-retries', queryRetries);
app.use('/paginated-queries', paginatedQueries);
app.use('/infinite-queries', infiniteQueries);
app.use('/initial-query-data', initialQueryData);
app.use('/refetch-on-mount', refetchOnMount);
app.use('/placeholder-data', placeholderData);

app.listen(5000, () => console.log('Server running'));
