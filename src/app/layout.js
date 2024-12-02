"use client";

import 'rsuite/dist/rsuite-no-reset.min.css';
import './globals.css';
import Image from "next/image";
import LOGOSVG from '../../public/logo.svg';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, theme } from './_constants/nav-bar';
import { isTokenValid, getAccessToken } from './_utils/auth';
import LogoutButton from './_components/logout';

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const currentPathName = usePathname();
  const router = useRouter();
  const noDashboardRoutes = ['/login', '/signup'];
  const isNoDashboardPage = noDashboardRoutes.includes(currentPathName);

  useEffect(() => {
    const token = getAccessToken();
    const valid = isTokenValid(token);

    setIsAuthenticated(valid);
    setIsLoading(false);

    if (!valid && !isNoDashboardPage) {
      router.push('/login');
    } else if (valid && isNoDashboardPage) {
      router.push('/dashboard');
    }
  }, [currentPathName, isNoDashboardPage, router]);

  // Render a loading state while authentication status is being determined
  if (isLoading) {
    return null; // or a loader/spinner component
  }

  // Conditional rendering based on route and authentication status
  if (isNoDashboardPage) {
    // Non-dashboard pages (e.g., login, signup)
    return (
      <html lang="en">
        <body>
          <AppProvider
            navigation={NAVIGATION}
            branding={{
              logo: <Image src={LOGOSVG} alt={"ResuMatch"}/>,
              title: 'ResuMatch',
            }}
            theme={theme}
          >
            <div>{children}</div>
          </AppProvider>
        </body>
      </html>
    );
  }

  // Dashboard pages
  return (
    <html lang="en">
      <body>
        <AppProvider
          navigation={NAVIGATION}
          branding={{
            logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
            title: 'MUI',
          }}
          theme={theme}
        >
          <DashboardLayout
            slots={{
              toolbarActions: LogoutButton,
            }}
          >
            {/* Main Content */}
            <div className="flex">
              <div className="flex-1">{children}</div>
            </div>
          </DashboardLayout>
        </AppProvider>
      </body>
    </html>
  );
}