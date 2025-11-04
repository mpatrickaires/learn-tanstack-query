import { Router } from 'express';
import { getTime } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  res.send({ title: 'This is the title', description: `Now is ${getTime()}` });
});

export { router };
