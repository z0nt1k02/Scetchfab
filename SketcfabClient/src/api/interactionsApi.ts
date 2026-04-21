import { modelsAxios } from './axios';
import type { Comment } from '../types';

export interface LikeState {
  count: number;
  liked: boolean;
}

export async function getLikeState(
  modelId: string,
  userId: string | null
): Promise<LikeState> {
  const { data } = await modelsAxios.get<LikeState>(`/models/${modelId}/likes`, {
    params: userId ? { userId } : undefined,
  });
  return data;
}

export async function toggleLike(
  modelId: string,
  userId: string
): Promise<LikeState> {
  const { data } = await modelsAxios.post<LikeState>(`/models/${modelId}/like`, {
    userId,
  });
  return data;
}

interface CommentResponse {
  id: string;
  modelId: string;
  userId: string;
  nickname: string;
  text: string;
  createdAt: string;
}

export async function getComments(modelId: string): Promise<Comment[]> {
  const { data } = await modelsAxios.get<CommentResponse[]>(
    `/models/${modelId}/comments`
  );
  return data;
}

export async function addComment(
  modelId: string,
  userId: string,
  nickname: string,
  text: string
): Promise<Comment> {
  const { data } = await modelsAxios.post<CommentResponse>(
    `/models/${modelId}/comments`,
    { userId, nickname, text }
  );
  return data;
}

export async function deleteComment(
  commentId: string,
  userId: string
): Promise<boolean> {
  try {
    await modelsAxios.delete(`/comments/${commentId}`, { params: { userId } });
    return true;
  } catch {
    return false;
  }
}

export async function incrementView(modelId: string): Promise<void> {
  try {
    await modelsAxios.post(`/models/${modelId}/view`);
  } catch {
    /* non-critical */
  }
}

export async function incrementDownload(modelId: string): Promise<void> {
  try {
    await modelsAxios.post(`/models/${modelId}/download`);
  } catch {
    /* non-critical */
  }
}

export async function getUserLikedModelIds(userId: string): Promise<string[]> {
  const { data } = await modelsAxios.get<string[]>(`/users/${userId}/liked`);
  return data;
}

const UPLOADS_KEY = 'user_uploads';
type UploadsMap = Record<string, string[]>;

function readUploads(): UploadsMap {
  try {
    return JSON.parse(localStorage.getItem(UPLOADS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeUploads(uploads: UploadsMap) {
  localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads));
}

export function addUserUpload(userId: string, modelId: string) {
  const uploads = readUploads();
  const list = uploads[userId] ?? [];
  if (!list.includes(modelId)) list.push(modelId);
  uploads[userId] = list;
  writeUploads(uploads);
}

export function getUserUploads(userId: string): string[] {
  return readUploads()[userId] ?? [];
}
