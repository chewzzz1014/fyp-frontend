"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isTokenValid, getAccessToken } from "./_utils/auth";

export default function NotFoundPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getAccessToken();
        setIsAuthenticated(isTokenValid(token)); 
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
            <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-xl mb-4">Sorry, the page you are looking for does not exist.</p>
            {isAuthenticated ? (
                <>
                    <Link href="/dashboard">
                        <p className="text-lg mb-4">
                            Go to <span className="text-blue-500 underline">dashboard</span>
                        </p>
                    </Link>
                </>
            ) : (
                <>
                    <Link href="/login">
                        <p className="text-lg mb-4">
                            Login <span className="text-blue-500 underline">here</span>
                        </p>
                    </Link>
                </>
            )}
        </div>
    );
};