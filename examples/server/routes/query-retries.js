import { Router } from 'express';
import { sleep } from '../utils.js';

const router = Router();

router.get('/:attempt', async (req, res) => {
  sleep(1);
  if (req.params.attempt < 3) {
    res.status(500);
    res.send('Error');
    return;
  }
  res.send('Query retries success response!');
});

export { router };
