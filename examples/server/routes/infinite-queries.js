import { Router } from 'express';
import { buildPaginatedResult } from '../utils.js';

const router = Router();

router.get('/:page', async (req, res) => {
  const result = await buildPaginatedResult(req.params.page, 15);

  return res.send(result);
});

export { router };
