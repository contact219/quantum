import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error, status } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    // Always refetch on mount to get fresh auth status
    staleTime: 0,
    refetchOnMount: true,
  });

  // Check if the error is a 401 Unauthorized
  // Handle both active errors and error status from cache
  const isUnauthorized = 
    (error && /^401:/.test((error as Error).message)) || 
    (status === 'error' && !user);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isUnauthorized,
    isUnauthorized: isUnauthorized || false,
  };
}
