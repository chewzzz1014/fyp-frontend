"use client";

import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    FormHelperText,
    Grid,
} from "@mui/material";
import { resume_text_1, resume_text_2 } from "../_constants/resume";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";

export default function JobResumePage() {
    const router = useRouter();

    // Sample resumes
    const uploadedResumes = [
        { id: 1, name: "Resume 1", content: resume_text_1 },
        { id: 2, name: "Resume 2", content: resume_text_2 },
    ];

    // State for resume selection and preview
    const [selectedResume, setSelectedResume] = useState(null);

    // State for job details
    const [jobDetails, setJobDetails] = useState({
        title: "",
        company: "",
        link: "",
        applicationStatus: "",
        jobDesc: "",
    });

    const [errors, setErrors] = useState({
        resume: false,
        title: false,
        company: false,
        link: false,
        applicationStatus: false,
        jobDesc: false,
    });

    // Handle resume selection
    const handleResumeChange = (event) => {
        const resumeId = event.target.value;
        const resume = uploadedResumes.find((r) => r.id === resumeId);
        setSelectedResume(resume);
    };

    // Handle job details input
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setJobDetails({ ...jobDetails, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate all fields
        const newErrors = {
            resume: !selectedResume,
            title: !jobDetails.title.trim(),
            company: !jobDetails.company.trim(),
            link: !jobDetails.link.trim(),
            applicationStatus: !jobDetails.applicationStatus,
            jobDesc: !jobDetails.jobDesc.trim(),
        };

        setErrors(newErrors);

        // Only navigate if there are no validation errors
        if (Object.values(newErrors).every((error) => !error)) {
            router.push("/job-resume/result");
        }
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8 mx-8">Job-Resume Matching Evaluation</h1>

            <form onSubmit={handleSubmit}>
                {/* Resume Section */}
                <Box mb={4} sx={{ mx: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Resume
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }} error={errors.resume}>
                        <InputLabel>Select a Resume</InputLabel>
                        <Select
                            value={selectedResume ? selectedResume.id : ""}
                            onChange={handleResumeChange}
                            label="Select a Resume"
                        >
                            {uploadedResumes.map((resume) => (
                                <MenuItem key={resume.id} value={resume.id}>
                                    {resume.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.resume && (
                            <FormHelperText sx={{ color: "error.main" }}>
                                Selecting a resume is required
                            </FormHelperText>
                        )}
                    </FormControl>

                    {selectedResume && (
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1">
                                    <strong>Preview:</strong>
                                </Typography>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {selectedResume.content}
                                </ReactMarkdown>
                            </CardContent>
                        </Card>
                    )}
                </Box>

                {/* Job Section */}
                <Box mb={4} sx={{ mx: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Job Details
                    </Typography>
                    {/* First Row: Job Title and Job Link */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Job Title"
                                name="title"
                                value={jobDetails.title}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                error={errors.title}
                                helperText={errors.title && "Job title is required"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Job Link"
                                name="link"
                                value={jobDetails.link}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                error={errors.link}
                                helperText={errors.link && "Job link is required"}
                            />
                        </Grid>
                    </Grid>

                    {/* Second Row: Company and Application Status */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Company"
                                name="company"
                                value={jobDetails.company}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                error={errors.company}
                                helperText={errors.company && "Company is required"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={errors.applicationStatus} required>
                                <InputLabel>Application Status</InputLabel>
                                <Select
                                    name="applicationStatus"
                                    value={jobDetails.applicationStatus}
                                    onChange={handleInputChange}
                                    label="Application Status"
                                >
                                    <MenuItem value="Applied">Applied</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Rejected">Rejected</MenuItem>
                                    <MenuItem value="Accepted">Accepted</MenuItem>
                                </Select>
                                {errors.applicationStatus && (
                                    <FormHelperText sx={{ color: "error.main" }}>
                                        Application status is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Third Row: Job Description */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Job Description"
                                name="jobDesc"
                                value={jobDetails.jobDesc}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={4}
                                required
                                error={errors.jobDesc}
                                helperText={errors.jobDesc && "Job description is required"}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box textAlign="center">
                    <Button type="submit" variant="contained" color="primary">
                        Analyse
                    </Button>
                </Box>
            </form>
        </div>
    );
}