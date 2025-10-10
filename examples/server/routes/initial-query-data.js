import { Router } from 'express';
import { getTime, sleep } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  await sleep(1.1);
  res.send(`API data: ${getTime()}`);
});

export { router };
