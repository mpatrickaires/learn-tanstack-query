import { Router } from 'express';
import { sleep } from '../utils.js';

const router = Router();

router.post('/', async (req, res) => {
  await sleep(1.1);
  res.send(`Ok`);
});

export { router };
