"use client"
import 'rsuite/dist/rsuite-no-reset.min.css';
import "./globals.css";

import { usePathname, useRouter } from "next/navigation";
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, theme } from "./_constants/nav-bar";

export default function RootLayout({ children }) {
  const currentPathName = usePathname();
  const noDashboardRoutes = ['/login', '/signup'];
  const isNoDashboardPage = noDashboardRoutes.includes(currentPathName);
  console.log(currentPathName);

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
          {isNoDashboardPage ? (
            <div>{children}</div>
          ) : (
            <DashboardLayout>
              <div className="flex">
                <div className="flex-1">{children}</div>
              </div>
            </DashboardLayout>
          )}
        </AppProvider>
      </body>
    </html>
  );
}