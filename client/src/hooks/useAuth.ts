import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role?: string;
}

export function useAuth() {
  const { data: user, isLoading, error, status } = useQuery<User>({
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

  const isAdmin = user?.role === "admin";

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isUnauthorized,
    isUnauthorized: isUnauthorized || false,
    isAdmin,
  };
}
