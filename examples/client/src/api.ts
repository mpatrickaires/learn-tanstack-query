import axios from 'axios';

export function buildApi(path: string) {
  return axios.create({
    baseURL: `http://localhost:5000${path}`,
  });
}
