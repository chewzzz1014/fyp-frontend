"use client";

import 'rsuite/dist/rsuite-no-reset.min.css';
import './globals.css';

import { usePathname, useRouter } from 'next/navigation';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, theme } from './_constants/nav-bar';
import { AuthGuard } from './_middleware/auth';
import { isTokenValid, getAccessToken } from './_utils/auth';

export default function RootLayout({ children }) {
  const token = getAccessToken();
  const currentPathName = usePathname();
  const noDashboardRoutes = ['/login', '/signup'];
  const isNoDashboardPage = noDashboardRoutes.includes(currentPathName);

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
          {(!isTokenValid(token) || isNoDashboardPage) ? (
            <div>{children}</div>
          ) : (
            <AuthGuard>
              <DashboardLayout>
                <div className="flex">
                  <div className="flex-1">{children}</div>
                </div>
              </DashboardLayout>
            </AuthGuard>
          )}
        </AppProvider>
      </body>
    </html>
  );
}