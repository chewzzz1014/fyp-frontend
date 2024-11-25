import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import InsightsIcon from '@mui/icons-material/Insights';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { extendTheme } from '@mui/material/styles';

export const NAVIGATION = [
    {
        kind: 'header',
        title: 'Main',
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
        pattern: 'dashboard',
    },
    {
        segment: 'resume',
        title: 'Resume',
        icon: <ArticleIcon />,
        pattern: 'resume',
    },
    {
        segment: 'job-resume',
        title: 'Job-Resume Match',
        icon: <InsightsIcon />,
        pattern: 'job-resume',
    },
    {
        kind: 'header',
        title: 'Info',
    },
    {
        segment: 'profile',
        title: 'Profile',
        icon: <AccountCircleIcon />,
        pattern: 'profile',
    },
    {
        segment: 'about',
        title: 'About',
        icon: <InfoIcon />,
        pattern: 'about',
    },
    {
        segment: 'logout',
        title: 'Logout',
        icon: <LogoutIcon />,
        pattern: 'logout',
    },
];

export const theme = extendTheme({
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