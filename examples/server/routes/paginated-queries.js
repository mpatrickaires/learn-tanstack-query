import { Router } from 'express';
import { arrayWithNumbers, sleep } from '../utils.js';

const router = Router();

const amountPerPage = 5;

router.get('/:page', async (req, res) => {
  const page = Number(req.params.page);

  // To load first page faster
  await sleep(page === 1 ? 0.5 : 1);

  let startWith = 0;
  switch (page) {
    // First page start with 1
    case 1:
      startWith = 1;
      break;
    // Second page start with 6: 5 + 1
    case 2:
      startWith = amountPerPage + 1;
      break;
    /**
     * Other pages start with a multiplier
     * (5 * (3 - 1)) + 1 = (5 * 2) + 1 = 10 + 1 = 11
     * (5 * (4 - 1)) + 1 = (5 * 3) + 1 = 15 + 1 = 16
     */
    default:
      startWith = amountPerPage * (page - 1) + 1;
      break;
  }

  const result = arrayWithNumbers(amountPerPage, startWith).map(
    n => `Item ${n}`
  );

  return res.send(result);
});

export { router };
