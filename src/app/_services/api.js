import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const signup = async (data) => {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    return response.data;
};

export const login = async (data) => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const getProfile = async () => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/user/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};