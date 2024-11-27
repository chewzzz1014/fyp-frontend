"use client";

import React from "react";

export default function ProfilePage() {
    const user = {
        username: "john_doe",
        email: "john.doe@example.com",
        registrationDate: "2024-01-15T10:30:00Z",
        lastLogin: "2024-01-15T10:30:00Z",
    };

    const resumes = [
        {
            uploadedDate: "2024-11-10T14:30:00Z",
            resumeName: "John_Doe_Resume_2024.pdf"
        },
        {
            uploadedDate: "2024-11-05T10:00:00Z",
            resumeName: "John_Doe_Resume_2023.pdf"
        },
    ];

    // Format the registration date to a more readable format
    const formattedRegistrationDate = new Date(user.registrationDate).toLocaleString();

    const formattedLastLoginDate = new Date(user.lastLogin).toLocaleString();

    // Format resume uploaded dates
    const formatDate = (date) => new Date(date).toLocaleString();

    return (
        <div className="p-8">
            {/* Title Section */}
            <h1 className="text-3xl font-bold mx-8 mb-8">Profile</h1>

            {/* Profile Details Section - Invisible table */}
            <div className="rounded-lg p-8">
                <table className="table-auto w-full text-xl mb-8">
                    <tbody>
                        <tr>
                            <td className="pr-4 py-2 font-semibold w-1/3">Username</td>
                            <td className="py-2 w-2/3">{user.username}</td>
                        </tr>
                        <tr>
                            <td className="pr-4 py-2 font-semibold w-1/3">Email</td>
                            <td className="py-2 w-2/3">{user.email}</td>
                        </tr>
                        <tr>
                            <td className="pr-4 py-2 font-semibold w-1/3">Registered on</td>
                            <td className="py-2 w-2/3">{formattedRegistrationDate}</td>
                        </tr>
                        <tr>
                            <td className="pr-4 py-2 font-semibold w-1/3">Last login</td>
                            <td className="py-2 w-2/3">{formattedLastLoginDate}</td>
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
                        {resumes.map((resume, index) => (
                            <tr key={index} className="border-t">
                                <td className="px-4 py-2 text-center">{formatDate(resume.uploadedDate)}</td>
                                <td className="px-4 py-2 text-center">{resume.resumeName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}