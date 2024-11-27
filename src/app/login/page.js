"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../_services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (data) => {
    try {
      const response = await login(data);
      console.log(response);
      localStorage.setItem('access_token', response.access_token);
      router.push('/resume');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail); // Show backend error message
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    handleLogin({ email, password });
  };

  const handleSignupRedirect = () => {
    router.push('/signup');
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-semibold">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs sm:max-w-sm">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded-md text-black"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded-md text-black"
              placeholder="Enter your password"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          <button type="submit" className="rounded-full border border-solid border-transparent bg-foreground text-background h-10 sm:h-12 px-4 sm:px-5 mt-4 text-sm sm:text-base">
            Login
          </button>
        </form>

        <p className="mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <button
            onClick={handleSignupRedirect}
            className="text-blue-500 underline"
          >
            Sign up here
          </button>
        </p>
      </main>
    </div>
  );
}