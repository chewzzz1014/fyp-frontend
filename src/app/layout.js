"use client";

import 'rsuite/dist/rsuite-no-reset.min.css';
import './globals.css';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, theme } from './_constants/nav-bar';
import { isTokenValid, getAccessToken } from './_utils/auth';
import LogoutButton from './_components/logout';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';

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

  if (isLoading) {
    return null;
  }

  // has no dashboard
  if (isNoDashboardPage) {
    return (
      <html lang="en">
        <body>
          <AppProvider
            navigation={NAVIGATION}
            branding={{
              logo: <TipsAndUpdatesOutlinedIcon fontSize="large" />,
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

  // has dashboard
  return (
    <html lang="en">
      <body>
        <AppProvider
          navigation={NAVIGATION}
          branding={{
            logo: <TipsAndUpdatesOutlinedIcon fontSize="large" />,
            title: 'ResuMatch',
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