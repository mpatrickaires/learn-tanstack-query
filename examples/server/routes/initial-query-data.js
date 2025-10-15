import { Router } from 'express';
import { arrayWithNumbers, getTime, sleep } from '../utils.js';

const router = Router();

router.get('/staleTime', async (req, res) => {
  await sleep(1.1);
  res.send(`API Data ${getTime()}`);
});

router.get('/initialDataUpdatedAt', async (req, res) => {
  res.send(`API Data ${getTime()}`);
});

router.get('/initial-data-from-cache/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (id === 0) {
    const items = arrayWithNumbers(3).map(id => new item(id));
    res.send(items);
    return;
  }

  await sleep(2);
  res.send(new item(id));
});

function item(id) {
  return { id, label: `Item ${id}`, description: `Description of item ${id}` };
}

export { router };
