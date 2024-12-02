import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const updateJobApplicationStatus = async (data) => {
    try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.put(
            `${API_URL}/job/application-status`,
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

export const getJobStatuses = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
            `${API_URL}/job/job-statuses`,
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
            throw new Error(error.response.data.detail || "An error occurred while fetching job statuses.");
        }
        throw new Error("Failed to connect to the server. Please try again later.");
    }
};