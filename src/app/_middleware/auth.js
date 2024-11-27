import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isTokenValid, getAccessToken } from '../_utils/auth';

export function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!isTokenValid(token)) {
      router.push('/login');
    }
  }, [router]);

  return children;
}