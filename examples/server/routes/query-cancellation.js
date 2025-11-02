import { Router } from 'express';
import { getTime, sleep } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  if (req.query.isInitialData === 'false') {
    await sleep(2);
  }
  res.send(`Response: ${getTime()}`);
});

export { router };
