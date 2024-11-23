"use client"
import 'rsuite/dist/rsuite-no-reset.min.css';
import "./globals.css";

import { useState, useMemo } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, theme } from "./_constants/nav-bar";
import SideNav from './_components/side-nav';

function useRouter(initialPath) {
  const [pathname, setPathname] = useState(initialPath);

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

export default function RootLayout({ children }) {
  const router = useRouter('/dashboard');

  return (
    <html lang="en">
      <body>
        <AppProvider
          navigation={NAVIGATION}
          branding={{
            logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
            title: 'MUI',
          }}
          router={router}
          theme={theme}
        >
          <DashboardLayout >
            <div className="flex">
              <div className="flex-1">{children}</div>
            </div>
          </DashboardLayout>
        </AppProvider>
      </body>
    </html>
  );
}