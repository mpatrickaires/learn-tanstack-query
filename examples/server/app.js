import express from 'express';
import cors from 'cors';
import { router as manualParallelQueriesRouter } from './routes/manual-parallel-queries.js';

const app = express();

app.use(cors());

app.use('/manual-parallel-queries', manualParallelQueriesRouter);

app.listen(5000, () => console.log('Server running'));
