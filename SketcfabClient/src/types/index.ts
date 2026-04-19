export interface Model {
  id: string;
  title: string;
  fileUrl: string;
  modelName?: string;
  viewerConfig?: string | null;
}

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
