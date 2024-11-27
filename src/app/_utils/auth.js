import { jwtDecode } from 'jwt-decode';

//  hash password using SHA-256
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export function isTokenValid(token) {
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();

        return expirationTime > currentTime;
    } catch (error) {
        return false;
    }
}

export function getAccessToken() {
    return localStorage.getItem('access_token');
}