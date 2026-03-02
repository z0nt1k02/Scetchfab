import { modelsAxios } from './axios';
import type { Model } from '../types';

export const getModels = async (page = 1, pageSize = 10): Promise<Model[]> => {
  const { data } = await modelsAxios.get<Model[] | { items: Model[] }>('/models', {
    params: { page, pageSize },
  });
  return Array.isArray(data) ? data : data.items;
};

export const getModel = async (id: string): Promise<Model> => {
  const { data } = await modelsAxios.get<Model>(`/models/${id}`);
  return data;
};

// Returns presigned S3 URL for file upload
export const createModel = async (title: string, modelName: string): Promise<string> => {
  const { data } = await modelsAxios.post<string>('/models', { title, modelName });
  return data;
};
