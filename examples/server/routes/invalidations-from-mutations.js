import { Router } from 'express';
import { sleep } from '../utils.js';

const defaultData = {
  title: 'Default title',
  description: 'Default description',
};

const store = [];

const router = Router();

router.post('/clear', async (req, res) => {
  // clear array
  store.length = 0;

  res.send('ok');
});

router.post('/:id', async (req, res) => {
  await sleep(1.5);

  const id = Number(req.params.id);
  const data = store.find(item => item.id === id);
  if (data) {
    data.title = req.body.title;
    data.description = req.body.description;
    res.send('ok');
    return;
  }

  store.push({ ...req.body, id });

  res.send('ok');
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const data = store.find(item => item.id === id);

  if (!data) {
    res.send(defaultData);
    return;
  }

  await sleep(1.5);
  res.send(data);
});

export { router };
