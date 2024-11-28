import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const uploadResume = async (data) => {
    try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.post("/api/upload_resume", formData, { headers });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || "An error occurred while uploading the resume.");
        }
        throw new Error("Failed to connect to the server. Please try again later.");
    }
};