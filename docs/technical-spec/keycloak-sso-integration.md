# Technical Specification: Keycloak SSO Integration (Frontend)

## Overview

This document outlines the technical implementation details for integrating our frontend with the existing Keycloak SSO authentication backend. The integration will automate Nflow API token management, replacing the current manual process of copying and pasting tokens.

## Existing Backend Services

Based on the API documentation, the following endpoints are already implemented:

1. `GET /auth/keycloak/login` - Initiates login flow and redirects to Keycloak
2. `GET /auth/keycloak/callback` - Handles the OAuth2 callback from Keycloak
3. `POST /auth/keycloak/refresh` - Refreshes access tokens
4. `POST /auth/keycloak/logout` - Logs out user from both application and Keycloak
5. `GET /auth/keycloak/status` - Checks current authentication status

## Frontend Architecture

### Authentication Flow

1. **User Authentication**

   - User clicks login button in the frontend application
   - Frontend redirects to `/auth/keycloak/login` endpoint
   - Backend redirects to Keycloak for authentication
   - User authenticates with Keycloak credentials
   - Keycloak redirects back to our application's callback endpoint
   - Backend processes authentication and sets up the session
   - User is redirected to the application dashboard

2. **API Request Flow**

   - Frontend makes authenticated requests to backend API
   - Backend automatically handles token validation and renewal
   - If token refresh is needed, it happens transparently

3. **Logout Flow**
   - User clicks logout in the application
   - Frontend calls `/auth/keycloak/logout` endpoint
   - Backend handles both local and Keycloak session termination

### Frontend Components

1. **AuthContext and Provider**

   - Manages frontend authentication state
   - Tracks user authentication status
   - Provides login/logout methods
   - Exposes current user information

2. **Auth API Client**

   - Wraps backend auth endpoints in a clean API
   - Handles requests to login, logout, check status

3. **Login Button Component**

   - Handles user click for login
   - Initiates auth flow
   - Shows loading state during authentication

4. **Protected Route Component**

   - Higher-order component to protect routes
   - Redirects unauthenticated users to login

5. **User Profile Component**
   - Displays user information from authentication
   - Shows login status
   - Provides logout option

## Technical Design

### Frontend Auth State Management

1. **Auth Context State**

   - Authentication status (authenticated, loading, error)
   - User information
   - Login/logout methods

2. **API Integration**
   - Wrapper for backend auth endpoints
   - Error handling for auth operations

## Implementation Details

### AuthContext Interface

```typescript
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
```

### Auth API Service

```typescript
interface AuthService {
  login(): void;
  logout(): Promise<void>;
  getAuthStatus(): Promise<{ authenticated: boolean; user?: User }>;
}
```

### Protected Route Implementation

```typescript
function ProtectedRoute({
  children,
  fallback = <Navigate to="/login" />,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : fallback;
}
```

## State Management

The application will use React Context for authentication state management:

1. **Auth State**

   - isAuthenticated: boolean
   - isLoading: boolean
   - user: User | null
   - error: string | null

2. **Auth Actions**
   - login(): void
   - logout(): Promise<void>
   - checkAuthStatus(): Promise<void>

## Error Handling

1. **Authentication Errors**

   - Display user-friendly error messages for failed login attempts
   - Provide retry options for network-related failures
   - Log authentication errors for debugging

2. **Session Expiration**
   - Detect 401 Unauthorized responses
   - Attempt token refresh automatically via backend
   - Redirect to login page if refresh fails

## User Experience Considerations

1. **Loading States**

   - Show loading indicators during authentication processes
   - Disable interactive elements during auth operations
   - Provide feedback for login/logout actions

2. **Redirect Handling**

   - Preserve intended destination before login redirect
   - Return user to original location after successful authentication
   - Handle deep linking to protected routes

3. **Persistent Login**
   - When user returns to the application, check auth status automatically
   - Restore session if valid
   - Redirect to login if session is invalid/expired

## Testing Strategy

1. **Unit Tests**

   - Test individual auth components
   - Mock auth service responses
   - Verify state management for different auth scenarios

2. **Integration Tests**

   - Test AuthContext with mocked API responses
   - Verify protected routes behavior
   - Test login and logout user flows

3. **End-to-End Tests**
   - Test complete login, protected access, and logout flows
   - Test session persistence across page reloads
   - Test handling of expired sessions

## Accessibility Considerations

1. **Keyboard Navigation**

   - Ensure login/logout actions are keyboard accessible
   - Manage focus appropriately during auth redirects

2. **Screen Reader Support**
   - Provide appropriate ARIA attributes for auth status
   - Include descriptive error messages
   - Use proper semantic HTML for auth components

## Dependencies

- React (for UI components and context)
- React Router (for protected routes)
- TypeScript (for type safety)
- Shadcn UI (for consistent UI components)

```

```
