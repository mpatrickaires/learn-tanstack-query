import express from 'express';
import cors from 'cors';
import { router as parallelQueriesManualRouter } from './routes/parallel-queries-manual.js';
import { router as parallelQueriesDynamicRouter } from './routes/parallel-queries-dynamic.js';
import { router as dedupingRouter } from './routes/deduping.js';
import { router as backgroundFetchingIndicator } from './routes/background-fetching-indicators.js';

const app = express();

app.use(cors());

app.use('/parallel-queries-manual', parallelQueriesManualRouter);
app.use('/parallel-queries-dynamic', parallelQueriesDynamicRouter);
app.use('/deduping', dedupingRouter);
app.use('/background-fetching-indicators', backgroundFetchingIndicator);

app.listen(5000, () => console.log('Server running'));
