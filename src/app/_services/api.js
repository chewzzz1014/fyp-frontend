import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/auth',
});

export const signup = async (data) => {
    try {
        const response = await API.post("/signup", data);
        return response.data;
    } catch (error) {
        throw error.response || error;
    }
}

export const login = async (data) => {
    try {
        const response = await API.post("/login", data);
        return response.data;
    } catch (error) {
        throw error.response || error;
    }
}