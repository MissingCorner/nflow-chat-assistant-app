import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current path for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== redirectTo) {
        const searchParams = new URLSearchParams();
        searchParams.set("redirect", currentPath);
        navigate(`${redirectTo}?${searchParams.toString()}`);
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : null;
}
