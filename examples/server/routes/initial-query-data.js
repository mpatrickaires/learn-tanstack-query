import { Router } from 'express';
import { getTime, sleep } from '../utils.js';

const router = Router();

router.get('/staleTime', async (req, res) => {
  await sleep(1.1);
  res.send(getResponse());
});

router.get('/initialDataUpdatedAt', async (req, res) => {
  res.send(getResponse());
});

function getResponse() {
  return `API Data ${getTime()}`;
}

export { router };
