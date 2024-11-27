import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !isTokenValid(token)) {
      router.push("/login");
    }
  }, [router]);

  return children;
}
