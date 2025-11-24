import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Check if the error is a 401 Unauthorized
  const isUnauthorized = error && /^401:/.test((error as Error).message);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isUnauthorized,
    isUnauthorized: isUnauthorized || false,
  };
}
