export interface Model {
  id: string;
  title: string;
  fileUrl: string;
  modelName?: string;
  viewerConfig?: string | null;
  previewUrl?: string | null;
  category?: string | null;
  tags?: string[];
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  downloadCount?: number;
}

export interface ImageAsset {
  id: string;
  title: string;
  fileUrl: string;
  fileName: string;
  creatorName: string;
  category?: string | null;
  tags: string[];
  viewCount: number;
  downloadCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'] as const;

export const MODEL_CATEGORIES = [
  'Персонажи',
  'Транспорт',
  'Архитектура',
  'Природа',
  'Оружие',
  'Мебель',
  'Электроника',
  'Другое',
] as const;

export type ModelCategory = (typeof MODEL_CATEGORIES)[number];

export interface ViewerConfig {
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
  };
  background: string;
  ambientIntensity: number;
  directionalIntensity: number;
  directionalPosition: [number, number, number];
  materials: Record<string, { color?: string; textureName?: string }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthUser {
  id: string;
  nickname: string;
  role?: string;
}

export interface Comment {
  id: string;
  modelId: string;
  userId: string;
  nickname: string;
  text: string;
  createdAt: string;
}
