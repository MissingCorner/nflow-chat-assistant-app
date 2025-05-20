import { AuthError, AuthStatus, TokenResponse } from "@/types/auth";

class AuthenticationError extends Error implements AuthError {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthService {
  private static instance: AuthService;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = "/api/auth/keycloak";
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public login(): void {
    window.location.href = `${this.baseUrl}/login`;
  }

  public async logout(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new AuthenticationError(
          "Logout failed",
          "LOGOUT_ERROR",
          response.status
        );
      }
    } catch {
      throw new AuthenticationError(
        "Network error during logout",
        "NETWORK_ERROR"
      );
    }
  }

  public async refreshTokens(): Promise<TokenResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new AuthenticationError(
          "Token refresh failed",
          "REFRESH_ERROR",
          response.status
        );
      }

      return await response.json();
    } catch {
      throw new AuthenticationError(
        "Network error during token refresh",
        "NETWORK_ERROR"
      );
    }
  }

  public async getAuthStatus(): Promise<AuthStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new AuthenticationError(
          "Failed to get auth status",
          "STATUS_ERROR",
          response.status
        );
      }

      return await response.json();
    } catch {
      throw new AuthenticationError(
        "Network error while checking auth status",
        "NETWORK_ERROR"
      );
    }
  }
}
