"use client";

import React from "react";

export default function AboutPage() {
    return (
        <div className="p-8">
            {/* Title Section */}
            <h1 className="text-4xl font-bold mb-6 text-center">About This Website</h1>

            {/* Introduction Section */}
            <p className="mb-6 text-lg text-justify">
                Welcome to our Resume Parsing and Job Matching tool! This platform allows you to easily upload your resume (in PDF format),
                parse it to extract important entities, and match your skills with the requirements of job descriptions.
            </p>
            <p className="mb-6 text-lg text-justify">
                Here, we explain how the tool works and the different features it provides:
            </p>

            {/* Features Section */}
            <h2 className="text-2xl font-semibold mt-6 mb-4">Key Features</h2>
            <p className="mb-4 text-lg text-justify">
                <strong>1. Resume Parsing:</strong> Upload your resume, and our tool will extract important information such as your personal details,
                education, work experience, and skills from the PDF.
            </p>
            <p className="mb-4 text-lg text-justify">
                <strong>2. Named Entity Recognition (NER):</strong> We perform NER on the parsed text to categorize and label the entities.
                This allows us to identify specific parts of your resume such as your name, contact information, educational qualifications, work history, and skills.
            </p>
            <p className="mb-4 text-lg text-justify">
                <strong>3. Job-Resume Matching:</strong> By extracting the skills from both the resume and a given job description, we compare the two to determine how well your qualifications align with the job&apos;s requirements.
            </p>

            {/* NER Table Section */}
            <h2 className="text-2xl font-semibold mt-6 mb-4">Entities Extracted from Resume</h2>
            <div className="overflow-x-auto bg-white text-black shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="px-4 py-2 text-center">Category</th>
                            <th className="px-4 py-2 text-center">Entity</th>
                            <th className="px-4 py-2 text-center">Entity Label Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="px-4 py-2">Personal Information</td>
                            <td className="px-4 py-2">Name</td>
                            <td className="px-4 py-2">NAME</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Personal Information</td>
                            <td className="px-4 py-2">Location</td>
                            <td className="px-4 py-2">LOC</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Personal Information</td>
                            <td className="px-4 py-2">Phone Number</td>
                            <td className="px-4 py-2">PHONE</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Personal Information</td>
                            <td className="px-4 py-2">Email Address</td>
                            <td className="px-4 py-2">EMAIL</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Education</td>
                            <td className="px-4 py-2">University or School Name</td>
                            <td className="px-4 py-2">UNI</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Education</td>
                            <td className="px-4 py-2">Academic Qualification Name</td>
                            <td className="px-4 py-2">DEG</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Education</td>
                            <td className="px-4 py-2">Study Period</td>
                            <td className="px-4 py-2">STUDY PER</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Work Experience</td>
                            <td className="px-4 py-2">Job Title</td>
                            <td className="px-4 py-2">JOB</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Work Experience</td>
                            <td className="px-4 py-2">Company Name</td>
                            <td className="px-4 py-2">COMPANY</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Work Experience</td>
                            <td className="px-4 py-2">Working Period</td>
                            <td className="px-4 py-2">WORK PER</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Skills</td>
                            <td className="px-4 py-2">Skill</td>
                            <td className="px-4 py-2">SKILL</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}