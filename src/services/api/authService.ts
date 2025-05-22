import { AuthError, AuthStatus, TokenResponse } from "@/types/auth";
import { API_ENDPOINTS, API_URL } from "./constants";
import { apiClient, ApiError } from "./apiClient";

export class AuthenticationError extends Error implements AuthError {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "AuthenticationError";
  }

  static fromApiError(error: ApiError): AuthenticationError {
    return new AuthenticationError(
      error.message,
      "API_ERROR",
      error.statusCode
    );
  }
}

export interface IAuthService {
  login(): void;
  logout(): Promise<void>;
  refreshTokens(): Promise<TokenResponse>;
  getAuthStatus(): Promise<AuthStatus>;
}

export class AuthService implements IAuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public login(): void {
    window.location.href = `${API_URL}${API_ENDPOINTS.AUTH.KEYCLOAK.LOGIN}`;
  }

  public async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.KEYCLOAK.LOGOUT);
    } catch (error) {
      if (error instanceof ApiError) {
        throw AuthenticationError.fromApiError(error);
      }
      throw new AuthenticationError(
        "Network error during logout",
        "NETWORK_ERROR"
      );
    }
  }

  public async refreshTokens(): Promise<TokenResponse> {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.KEYCLOAK.REFRESH
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw AuthenticationError.fromApiError(error);
      }
      throw new AuthenticationError(
        "Network error during token refresh",
        "NETWORK_ERROR"
      );
    }
  }

  public async getAuthStatus(): Promise<AuthStatus> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.KEYCLOAK.STATUS);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw AuthenticationError.fromApiError(error);
      }
      throw new AuthenticationError(
        "Network error while checking auth status",
        "NETWORK_ERROR"
      );
    }
  }
}

// Export a default instance
export const authService = AuthService.getInstance();
