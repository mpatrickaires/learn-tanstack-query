import { Router } from 'express';
import { sleep } from '../utils.js';

const defaultTodo = 'Default todo';

const store = [defaultTodo];

const router = Router();

router.post('/clear', async (req, res) => {
  store.length = 0;
  store.push(defaultTodo);
  res.send('ok');
});

router.post('/', async (req, res) => {
  await sleep(2);

  if (req.query.returnError == 'true') {
    res.status(400);
    res.send('error');
    return;
  }

  store.push(req.body.title);
  res.send('ok');
});

router.get('/', async (req, res) => {
  if (store.length > 1) {
    await sleep(2);
  }

  res.send(store);
});

export { router };
