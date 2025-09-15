import { Router } from 'express';
import { sleep } from '../utils.js';

const router = Router();

router.get('/user-name', async (req, res) => {
  await sleep(1.1);
  res.send('John Doe');
});

router.get('/team-name', async (req, res) => {
  await sleep(1.1);
  res.send('Primary team');
});

router.get('/project-name', async (req, res) => {
  await sleep(1.1);
  res.send('Quarter Project');
});

export { router };
