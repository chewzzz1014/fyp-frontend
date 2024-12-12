import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isTokenValid, getAccessToken } from '../_utils/auth';

// redirect to login page if user is not logged in
// usage: wrap main component
export function AuthGuard({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!isTokenValid(token)) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return null;
  }

  return children;
}