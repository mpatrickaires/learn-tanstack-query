import { Router } from 'express';
import { buildPaginatedResult } from '../utils.js';

const router = Router();

router.get('/cancel-refetch/:page', async (req, res) => {
  const page = Number(req.params.page);

  const result = await buildPaginatedResult(req.params.page, 15);

  return res.send({ page, result });
});

router.get('/sequential-refetch/:page', async (req, res) => {
  const page = Number(req.params.page);

  const result = (await buildPaginatedResult(req.params.page, 5)).map(
    value => `${value} (${new Date().toLocaleTimeString('pt-BR')})`
  );

  return res.send({ page, result });
});

router.get('/max-pages/:page', async (req, res) => {
  const page = Number(req.params.page);

  const result = await buildPaginatedResult(page, 5);

  return res.send({ page, result });
});

export { router };
