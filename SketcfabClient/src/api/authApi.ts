import { authAxios } from './axios';
import type { LoginCredentials, RegisterCredentials } from '../types';

export const login = async (credentials: LoginCredentials): Promise<void> => {
  await authAxios.post('/authentication/login', credentials);
};

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  await authAxios.post('/authentication/registration', credentials);
};
