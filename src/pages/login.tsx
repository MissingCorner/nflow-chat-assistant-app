import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to continue to your account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={login}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <span>Sign in with SSO</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
