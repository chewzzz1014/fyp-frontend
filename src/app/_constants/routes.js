import LoginPage from "../login/page";
import SignUpPage from "../signup/page";
import HomePage from "../page";
import ResumePage from "../resume/page";
import JobResumePage from "../job-resume/page";
import DashboardPage from "../dashboard/page";
import AboutPage from "../about/page";

export const routes = [
    {
        path: '/login',
        component: <LoginPage />,
    },
    {
        path: '/signup',
        component: <SignUpPage />,
    },
    {
        path: '/',
        component: <HomePage />,
    },
    {
        path: '/dashboard',
        component: <DashboardPage />,
    },
    {
        path: 'resume',
        component: <ResumePage />,
    },
    {
        path: '/job-resume',
        component: <JobResumePage />,
    },
    {
        path: '/about',
        component: <AboutPage />,
    },
]