import { modelsAxios } from './axios';
import type { Comment } from '../types';

export interface LikeState {
  count: number;
  liked: boolean;
}

export async function getImageLikeState(
  imageId: string,
  userId: string | null
): Promise<LikeState> {
  const { data } = await modelsAxios.get<LikeState>(`/images/${imageId}/likes`, {
    params: userId ? { userId } : undefined,
  });
  return data;
}

export async function toggleImageLike(
  imageId: string,
  userId: string
): Promise<LikeState> {
  const { data } = await modelsAxios.post<LikeState>(
    `/images/${imageId}/like`,
    { userId }
  );
  return data;
}

interface ImageCommentResponse {
  id: string;
  modelId: string;
  userId: string;
  nickname: string;
  text: string;
  createdAt: string;
}

export async function getImageComments(imageId: string): Promise<Comment[]> {
  const { data } = await modelsAxios.get<ImageCommentResponse[]>(
    `/images/${imageId}/comments`
  );
  return data.map((c) => ({
    id: c.id,
    modelId: c.modelId,
    userId: c.userId,
    nickname: c.nickname,
    text: c.text,
    createdAt: c.createdAt,
  }));
}

export async function addImageComment(
  imageId: string,
  userId: string,
  nickname: string,
  text: string
): Promise<Comment> {
  const { data } = await modelsAxios.post<ImageCommentResponse>(
    `/images/${imageId}/comments`,
    { userId, nickname, text }
  );
  return {
    id: data.id,
    modelId: data.modelId,
    userId: data.userId,
    nickname: data.nickname,
    text: data.text,
    createdAt: data.createdAt,
  };
}

export async function deleteImageComment(
  commentId: string,
  userId: string
): Promise<boolean> {
  try {
    await modelsAxios.delete(`/image-comments/${commentId}`, {
      params: { userId },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getUserLikedImageIds(userId: string): Promise<string[]> {
  const { data } = await modelsAxios.get<string[]>(
    `/users/${userId}/liked-images`
  );
  return data;
}
