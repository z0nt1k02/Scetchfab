export interface Model {
  id: string;
  title: string;
  fileUrl: string;
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
