import axios from 'axios';

export const modelsAxios = axios.create({ baseURL: '/api', withCredentials: true });

// /auth/* → proxy rewrites to /api/* on http://localhost:5185
export const authAxios = axios.create({ baseURL: '/auth', withCredentials: true });
