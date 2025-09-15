import { Router } from 'express';
import { sleep } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  await sleep(1.5);
  res.send(`Now is ${new Date()}`);
});

export { router };
