import { Router } from 'express';
import { getTime, sleep } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  res.send(`API Response ${getTime()}`);
});

export { router };
