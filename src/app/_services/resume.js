import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const uploadResume = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/resume/upload`, data);
        return response.data; // If successful, return parsed data
    } catch (error) {
        // Check if error has a response (backend validation failure)
        if (error.response) {
            throw new Error(error.response.data.detail || "An error occurred while uploading the resume.");
        }
        // Fallback for other types of errors (e.g., network issues)
        throw new Error("Failed to connect to the server. Please try again later.");
    }
};