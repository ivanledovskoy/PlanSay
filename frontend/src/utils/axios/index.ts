import axios from "axios";

export const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

// export const instance = axios.create({
//   baseURL: 'http://192.168.0.117:8000',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
// });