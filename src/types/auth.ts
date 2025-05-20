export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

export interface AuthError extends Error {
  code?: string;
  statusCode?: number;
}

export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: AuthError | null;
};

export type AuthContextValue = AuthState & {
  login: () => void;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
};
