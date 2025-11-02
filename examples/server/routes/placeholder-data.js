import { Router } from 'express';
import { sleep } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  const movieList = movies.map(({ id, title, releaseDate }) => ({
    id,
    title,
    releaseDate,
  }));
  res.send(movieList);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find(movie => movie.id === id);

  await sleep(2.5);

  if (!movie) {
    res.status = 404;
    res.send('Not found');
    return;
  }
  res.send(movie);
});

const movies = [
  {
    id: 1,
    title: 'Dr. Strangelove',
    director: 'Stanley Kubrick',
    releaseDate: new Date(1964, 1, 29).toLocaleDateString(),
    synopsis:
      'An American general puts the world on the verge of catastrophe when he orders an attack on the Soviet Union. Soon, a war council tries to put a stop to it before it is too late.',
  },
  {
    id: 2,
    title: '12 Angry Men',
    director: 'Sidney Lumet',
    releaseDate: new Date(1958, 10, 4).toLocaleDateString(),
    synopsis:
      'An eighteen-year-old Latino is accused of having stabbed his father to death. He is presented in a courtroom before a twelve-man jury. Eleven out of the twelve men vote guilty, except for Mr. Davis.',
  },
];

export { router };
