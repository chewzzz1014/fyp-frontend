"use client"
import 'rsuite/dist/rsuite-no-reset.min.css';
import "./globals.css";

import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import InsightsIcon from '@mui/icons-material/Insights';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'resume',
    title: 'Resume',
    icon: <ArticleIcon />,
  },
  {
    segment: 'job-resume',
    title: 'Job-Resume Match',
    icon: <InsightsIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Info',
  },
  {
    segment: 'about',
    title: 'About',
    icon: <InfoIcon />,
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
];

const theme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function RootLayout({ children }) {
  const router = useRouter('/dashboard');

  return (
    <html lang="en">
      <body>
        <AppProvider
          navigation={NAVIGATION}
          router={router}
          theme={theme}
        >
          <DashboardLayout>
            <div className="flex">
              <div className="flex-1">{children}</div>
            </div>
          </DashboardLayout>
        </AppProvider>
      </body>
    </html>
  );
}