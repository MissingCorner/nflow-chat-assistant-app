# Keycloak SSO Integration Roadmap (Frontend)

This document outlines the implementation plan and tasks for integrating our frontend with the existing Keycloak SSO authentication backend. The integration will automate Nflow API token management.

## Phase 1: Setup and Configuration

- [ ] Review existing backend API endpoints for Keycloak integration
- [ ] Set up environment configuration for frontend auth
- [ ] Define authentication state management interfaces

**Files to create/modify:**

- `src/lib/config.ts` - Add auth-related configuration
- `.env.example` - Update with relevant variables

## Phase 2: Authentication Service Implementation

- [ ] Create authentication service interfaces
- [ ] Implement auth API client for backend endpoints
- [ ] Create auth utilities for URL handling and storage

**Files to create:**

- `src/services/auth/types.ts` - Authentication interfaces
- `src/services/auth/auth-service.ts` - Service implementation for backend API
- `src/services/auth/auth-utils.ts` - Helper utilities

## Phase 3: Auth Context Implementation

- [ ] Create authentication context
- [ ] Implement authentication provider
- [ ] Develop hooks for accessing auth state

**Files to create:**

- `src/contexts/auth-context.tsx` - Context and provider implementation
- `src/hooks/use-auth.ts` - Custom hook for auth context

## Phase 4: Authentication Components

- [ ] Implement login button component
- [ ] Create user profile/info component
- [ ] Develop protected route component
- [ ] Add loading states and error handling

**Files to create:**

- `src/components/ui/auth-button.tsx` - Login/logout button
- `src/components/custom/user-profile.tsx` - User information display
- `src/components/custom/protected-route.tsx` - Route protection
- `src/components/ui/auth-loading.tsx` - Authentication loading states

## Phase 5: Route and Page Integration

- [ ] Add authentication to routing configuration
- [ ] Create login page
- [ ] Implement auth callback handling
- [ ] Add persistent login check on application start

**Files to create:**

- `src/pages/login.tsx` - Login page
- `src/pages/auth/callback.tsx` - OAuth callback handler

## Phase 6: Testing

- [ ] Write unit tests for auth context
- [ ] Create integration tests for authentication flow
- [ ] Develop end-to-end tests for login/logout

**Files to create:**

- `src/contexts/__tests__/auth-context.test.tsx`
- `src/services/auth/__tests__/auth-service.test.ts`
- `e2e/auth-flow.spec.ts`

## Phase 7: Documentation and Finalization

- [ ] Document authentication flow for developers
- [ ] Create user guide for authentication
- [ ] Optimize auth components for performance
- [ ] Review and enhance accessibility

**Files to create:**

- `docs/developer-guides/auth-integration.md`
- `docs/user-guides/login-guide.md`

## Progress Tracking

### Phase 1: Setup and Configuration

- [ ] Task 1.1: Review backend API - Due: Day 1
- [ ] Task 1.2: Set up environment config - Due: Day 1
- [ ] Task 1.3: Define auth interfaces - Due: Day 1

### Phase 2: Authentication Service

- [ ] Task 2.1: Create auth interfaces - Due: Day 2
- [ ] Task 2.2: Implement auth client - Due: Day 2
- [ ] Task 2.3: Create auth utilities - Due: Day 2

### Phase 3: Auth Context

- [ ] Task 3.1: Create auth context - Due: Day 3
- [ ] Task 3.2: Implement provider - Due: Day 3
- [ ] Task 3.3: Develop hooks - Due: Day 3

### Phase 4: Authentication Components

- [ ] Task 4.1: Login button - Due: Day 4
- [ ] Task 4.2: User profile - Due: Day 4
- [ ] Task 4.3: Protected route - Due: Day 4
- [ ] Task 4.4: Loading states - Due: Day 4

### Phase 5: Route and Page Integration

- [ ] Task 5.1: Add auth to routing - Due: Day 5
- [ ] Task 5.2: Login page - Due: Day 5
- [ ] Task 5.3: Callback handler - Due: Day 5
- [ ] Task 5.4: Persistent login - Due: Day 5

### Phase 6: Testing

- [ ] Task 6.1: Unit tests - Due: Day 6
- [ ] Task 6.2: Integration tests - Due: Day 6
- [ ] Task 6.3: E2E tests - Due: Day 6

### Phase 7: Documentation and Finalization

- [ ] Task 7.1: Developer docs - Due: Day 7
- [ ] Task 7.2: User guides - Due: Day 7
- [ ] Task 7.3: Performance optimization - Due: Day 7
- [ ] Task 7.4: Accessibility review - Due: Day 7

## Implementation Details

### Auth Context Implementation

```typescript
// src/contexts/auth-context.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/auth/auth-service";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const authService = new AuthService();

  // Check auth status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const status = await authService.getAuthStatus();
        setIsAuthenticated(status.authenticated);
        if (status.user) {
          setUser(status.user);
        }
      } catch (err) {
        setError("Failed to fetch authentication status");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = () => {
    authService.login();
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      setError("Failed to log out");
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

### Auth Service Implementation

```typescript
// src/services/auth/auth-service.ts
import { User } from "../../contexts/auth-context";

export class AuthService {
  login(): void {
    // Redirect to the backend login endpoint
    window.location.href = "/auth/keycloak/login";
  }

  async logout(): Promise<void> {
    await fetch("/auth/keycloak/logout", {
      method: "POST",
      credentials: "include",
    });
  }

  async getAuthStatus(): Promise<{ authenticated: boolean; user?: User }> {
    const response = await fetch("/auth/keycloak/status", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to get auth status: ${response.statusText}`);
    }

    return await response.json();
  }
}
```
