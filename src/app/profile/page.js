"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";
import { getProfile } from "../_services/profile";

export default function ProfilePage() {
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const response = await getProfile();
                setProfile(response);
            } catch (error) {
                setError("Failed to fetch job-resume");
            }
        };
        fetchResumes();
    }, []);

    const formatDate = (date) => new Date(date).toLocaleString();

    if (error) {
        return <div className="min-h-screen p-8">
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
                <Alert onClose={() => setError("")} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div>;
    }

    if (!profile) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1200,
                    flexDirection: "column",
                }}
            >
                <CircularProgress color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6" color="white">
                    Fetching data for you...
                </Typography>
            </Box>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mx-8 mb-8">Profile</h1>

            {/* Profile Details Section - Invisible table */}
            <div className="rounded-lg p-8">
                <table className="table-auto w-full text-xl mb-8">
                    <tbody>
                        <tr>
                            <td className="pr-4 py-2 font-semibold w-1/3">Username</td>
                            <td className="py-2 w-2/3">{profile.username}</td>
                        </tr>
                        <tr>
                            <td className="pr-4 py-2 font-semibold w-1/3">Email</td>
                            <td className="py-2 w-2/3">{profile.email}</td>
                        </tr>
                        <tr>
                            <td className="pr-4 py-2 font-semibold w-1/3">Registered on</td>
                            <td className="py-2 w-2/3">{new Date(profile.created_at).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="pr-4 py-2 font-semibold w-1/3">Last login</td>
                            <td className="py-2 w-2/3">{profile.last_login
                                ? new Date(profile.last_login).toLocaleString() : new Date(profile.created_at).toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Resume Information Section - Bordered table */}
            <h2 className="text-xl font-semibold mx-8">Resumes Uploaded</h2>
            <div className="rounded-lg p-8">
                <table className="table-auto w-full text-lg border border-gray-300">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="px-4 py-2 text-center">Uploaded on</th>
                            <th className="px-4 py-2 text-center">Resume Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profile.resumes.map((resume) => (
                            <tr key={resume.resume_id} className="border-t">
                                <td className="px-4 py-2 text-center">{formatDate(resume.uploaded_on)}</td>
                                <td className="px-4 py-2 text-center">{resume.resume_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}