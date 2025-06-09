import axios from "axios";

export const instance = axios.create({
  baseURL: 'https://127.0.0.1:8000',
  timeout: 1000,
  headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
});

// export const instance = axios.create({
//   baseURL: 'http://192.168.0.117:8000',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
// });
