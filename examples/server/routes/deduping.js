import { Router } from 'express';
import { sleep } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  await sleep(1.1);
  res.send('This is the deduping response!');
});

export { router };
