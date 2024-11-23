"use client"

import Link from "next/link";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
            <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-xl mb-4">Sorry, the page you are looking for does not exist.</p>
            <Link href="/dashboard">Go back to the <span className="text-blue-500 underline">homepage</span></Link>
        </div>
    );
};

export default NotFoundPage;