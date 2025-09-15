import { Router } from 'express';
import { sleep } from '../utils.js';

const router = Router();

router.get('/:id/user-name', async (req, res) => {
  await sleep(1.1);
  res.send(`User ${req.params.id}`);
});

export { router };
