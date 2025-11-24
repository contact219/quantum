import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isUnauthorized, isAdmin } = useAuth();

  // Redirect to login immediately if unauthorized
  useEffect(() => {
    if (isUnauthorized || (!isLoading && !isAuthenticated)) {
      // Use window.location.assign for full page navigation to OAuth flow
      window.location.assign("/api/login");
    }
    // Redirect to home if admin access required but user is not admin
    if (!isLoading && isAuthenticated && requireAdmin && !isAdmin) {
      window.location.assign("/");
    }
  }, [isUnauthorized, isAuthenticated, isLoading, requireAdmin, isAdmin]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  // The useEffect will trigger redirect
  if (isUnauthorized || !isAuthenticated) {
    return null;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return null;
  }

  // User is authenticated and has proper role, render the protected content
  return <>{children}</>;
}
