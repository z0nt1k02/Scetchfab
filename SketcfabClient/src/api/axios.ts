import axios from 'axios';

export const modelsAxios = axios.create({ baseURL: '/api' });

// /auth/* → proxy rewrites to /api/* on http://localhost:5185
export const authAxios = axios.create({ baseURL: '/auth' });
