import type { Comment } from '../types';

const LIKES_KEY = 'model_likes';
const COMMENTS_KEY = 'model_comments';

type LikesMap = Record<string, string[]>;

function readLikes(): LikesMap {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeLikes(likes: LikesMap) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
}

function readComments(): Comment[] {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function writeComments(comments: Comment[]) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export function getLikeState(modelId: string, userId: string | null) {
  const likes = readLikes();
  const users = likes[modelId] ?? [];
  return { count: users.length, liked: userId ? users.includes(userId) : false };
}

export function toggleLike(modelId: string, userId: string) {
  const likes = readLikes();
  const users = likes[modelId] ?? [];
  const idx = users.indexOf(userId);
  if (idx >= 0) users.splice(idx, 1);
  else users.push(userId);
  likes[modelId] = users;
  writeLikes(likes);
  return { count: users.length, liked: idx < 0 };
}

export function getComments(modelId: string): Comment[] {
  return readComments()
    .filter((c) => c.modelId === modelId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addComment(
  modelId: string,
  userId: string,
  nickname: string,
  text: string
): Comment {
  const comment: Comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    modelId,
    userId,
    nickname,
    text,
    createdAt: new Date().toISOString(),
  };
  const comments = readComments();
  comments.push(comment);
  writeComments(comments);
  return comment;
}

export function deleteComment(commentId: string, userId: string): boolean {
  const comments = readComments();
  const idx = comments.findIndex((c) => c.id === commentId && c.userId === userId);
  if (idx < 0) return false;
  comments.splice(idx, 1);
  writeComments(comments);
  return true;
}
