import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getAllJobResumes = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
            `${API_URL}/job-resume`,
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
            throw new Error(error.response.data.detail || "An error occurred while fetching job-resume.");
        }
        throw new Error("Failed to connect to the server. Please try again later.");
    }
};

export const getJobResume = async (jobResumeId) => {
    try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
            `${API_URL}/job-resume/${jobResumeId}`,
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
            throw new Error(error.response.data.detail || "An error occurred while fetching job-resume.");
        }
        throw new Error("Failed to connect to the server. Please try again later.");
    }
};

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

export const updateJobApplicationStatus = async (data) => {
    try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.put(
            `${API_URL}/job-resume/application-status`,
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
            throw new Error(error.response.data.detail || "An error occurred while updating job application status.");
        }
        throw new Error("Failed to connect to the server. Please try again later.");
    }
};