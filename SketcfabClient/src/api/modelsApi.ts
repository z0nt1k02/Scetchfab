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

export const createModel = async (
  title: string,
  modelName: string,
  viewerConfig?: string | null
): Promise<string> => {
  const { data } = await modelsAxios.post<string>('/models', {
    title,
    modelName,
    viewerConfig: viewerConfig ?? null,
  });
  return data;
};

export const updateViewerConfig = async (
  id: string,
  viewerConfig: string | null
): Promise<void> => {
  await modelsAxios.put(`/models/${id}/config`, { viewerConfig });
};
