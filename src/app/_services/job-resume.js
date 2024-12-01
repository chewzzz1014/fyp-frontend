import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const addJobResume = async (data) => {
    try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.post(
            `${API_URL}/job-resume`,
            data,
            {
                headers: {
                    ...headers,
                },
            }
        );
        console.log(response)
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || "An error occurred while analysing job-resume matching.");
        }
        throw new Error("Failed to connect to the server. Please try again later.");
    }
};

export const getResumes = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
            `${API_URL}/resume`,
            {
                headers: {
                    ...headers
                },
            }
        );
        console.log(response)
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || "An error occurred while analysing job-resume matching.");
        }
        throw new Error("Failed to connect to the server. Please try again later.");
    }
};