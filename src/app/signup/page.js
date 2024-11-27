"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { signup } from '../_services/api';
import { hashPassword, validateEmail } from '../_utils/auth';
import { isTokenValid, getAccessToken } from '../_utils/auth';

export default function SignUpPage() {
  const router = useRouter();
  const token = getAccessToken();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // redirect if user is already logged in
  useEffect(() => {
    if (isTokenValid(token)) {
      router.back();
    }
  }, [token, router]);

  const handleSignup = async (data) => {
    try {
      // Hash the password before sending it to the backend
      const hashedPassword = await hashPassword(data.password);
      const signupData = { ...data, password: hashedPassword };

      const response = await signup(signupData);

      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);

      // Show success dialog
      setIsSuccessOpen(true);
      setTimeout(() => {
        router.push('/resume');
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    // Validate input fields
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are mandatory');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    await handleSignup({ username, email, password });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-1/3 mx-auto">
        <h1 className="text-2xl font-semibold">Sign Up</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 p-2 rounded-md text-black"
              placeholder="Enter your username"
            />
          </div>

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

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded-md text-black"
              placeholder="Confirm your password"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          <button type="submit" className="rounded-full border border-solid border-transparent bg-foreground text-background h-10 sm:h-12 px-4 sm:px-5 mt-4 text-sm sm:text-base">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-500 underline"
          >
            Login here
          </button>
        </p>
      </main>

      <Dialog open={isSuccessOpen} onClose={() => setIsSuccessOpen(false)}>
        <DialogTitle>Account Created Successfully</DialogTitle>
        <DialogContent>
          <Typography>Your account has been created. Start by adding your resume!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSuccessOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}