import { modelsAxios } from './axios';
import type { ImageAsset } from '../types';

export interface ImageFilters {
  q?: string;
  category?: string;
  tag?: string;
}

export interface CreateImageResponse {
  id: string;
  uploadUrl: string;
}

export const getImages = async (
  page = 1,
  pageSize = 50,
  filters: ImageFilters = {}
): Promise<ImageAsset[]> => {
  const params: Record<string, string | number> = { page, pageSize };
  if (filters.q) params.q = filters.q;
  if (filters.category) params.category = filters.category;
  if (filters.tag) params.tag = filters.tag;
  const { data } = await modelsAxios.get<ImageAsset[]>('/images', { params });
  return data;
};

export const getImage = async (id: string): Promise<ImageAsset> => {
  const { data } = await modelsAxios.get<ImageAsset>(`/images/${id}`);
  return data;
};

export const createImage = async (
  title: string,
  fileName: string,
  options: { category?: string | null; tags?: string[] } = {}
): Promise<CreateImageResponse> => {
  const { data } = await modelsAxios.post<CreateImageResponse>('/images', {
    title,
    fileName,
    category: options.category ?? null,
    tags: options.tags ?? [],
  });
  return data;
};

export const incrementImageView = async (id: string): Promise<void> => {
  try {
    await modelsAxios.post(`/images/${id}/view`);
  } catch {
    /* non-critical */
  }
};

export const incrementImageDownload = async (id: string): Promise<void> => {
  try {
    await modelsAxios.post(`/images/${id}/download`);
  } catch {
    /* non-critical */
  }
};
