import { modelsAxios } from './axios';
import type { Model } from '../types';

export interface CreateModelResponse {
  model: string;
  preview: string;
  id: string;
}

export interface ModelFilters {
  q?: string;
  category?: string;
  tag?: string;
}

export const getModels = async (
  page = 1,
  pageSize = 10,
  filters: ModelFilters = {}
): Promise<Model[]> => {
  const params: Record<string, string | number> = { page, pageSize };
  if (filters.q) params.q = filters.q;
  if (filters.category) params.category = filters.category;
  if (filters.tag) params.tag = filters.tag;
  const { data } = await modelsAxios.get<Model[] | { items: Model[] }>('/models', {
    params,
  });
  return Array.isArray(data) ? data : data.items;
};

export const getModel = async (id: string): Promise<Model> => {
  const { data } = await modelsAxios.get<Model>(`/models/${id}`);
  return data;
};

export interface CreateModelOptions {
  viewerConfig?: string | null;
  category?: string | null;
  tags?: string[];
}

export const createModel = async (
  title: string,
  modelName: string,
  options: CreateModelOptions = {}
): Promise<CreateModelResponse> => {
  const { data } = await modelsAxios.post<CreateModelResponse>('/models', {
    title,
    modelName,
    viewerConfig: options.viewerConfig ?? null,
    category: options.category ?? null,
    tags: options.tags ?? [],
  });
  return data;
};

export const updateViewerConfig = async (
  id: string,
  viewerConfig: string | null
): Promise<void> => {
  await modelsAxios.put(`/models/${id}/config`, { viewerConfig });
};
