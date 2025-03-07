"use client";

import React from "react";
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function AboutPage() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">About ResuMatch <TipsAndUpdatesOutlinedIcon fontSize="large" /></h1>

            <p className="mb-6 text-lg text-justify">
                Welcome to ResuMatch! This platform provides easy way to manage your job applications and to improve your resume.
            </p>

            <div className="flex items-center mt-6 mb-4">
                <InfoOutlinedIcon fontSize="medium" className="mr-3" />
                <h2 className="text-2xl font-semibold">Key Features</h2>
            </div>
            <p className="mb-4 text-lg text-justify">
                <strong>1. Resume Parsing:</strong> Upload your resume in PDF format and extract the contents.
            </p>
            <p className="mb-4 text-lg text-justify">
                <strong>2. Named Entity Recognition (NER):</strong> Perform NER on the parsed resume contents to categorize and label the entities.
                This identifies specific parts of your resume such as your name, contact information, educational qualifications, work history, and skills.
            </p>
            <p className="mb-4 text-lg text-justify">
                <strong>3. Job-Resume Matching:</strong> By extracting and comparing the skills from both the resume and a given job description, it produces a job-resume score that tells how well your qualifications align with the job&apos;s requirements!
            </p>
            <p className="mb-4 text-lg text-justify">
                <strong>4. Dashboard:</strong> Kanban board helps you to organise and update your job applications easily. It also displays and compares the NER entities between a resume and job description.
            </p>

            <div className="flex items-center mt-6 mb-4">
                <InfoOutlinedIcon fontSize="medium" className="mr-3" />
                <h2 className="text-2xl font-semibold">Entities Extracted from Resume</h2>
            </div>
            <div className="overflow-x-auto text-black shadow-md rounded-lg">
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