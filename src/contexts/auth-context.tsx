import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContextValue, AuthState } from "@/types/auth";
import { AuthService } from "@/services/auth";

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const authService = AuthService.getInstance();

  const checkAuthStatus = useCallback(async () => {
    try {
      const status = await authService.getAuthStatus();
      setState((prev) => ({
        ...prev,
        isAuthenticated: status.authenticated,
        user: status.user || null,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, [authService]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    authService.login();
  }, [authService]);

  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authService.logout();
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, [authService]);

  const refreshTokens = useCallback(async () => {
    try {
      await authService.refreshTokens();
      await checkAuthStatus();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        error: error as Error,
      }));
    }
  }, [authService, checkAuthStatus]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
