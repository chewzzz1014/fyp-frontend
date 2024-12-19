"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { getResumes } from "../_services/resume";
import { addJobResume } from "../_services/job-resume";
import { getJobStatuses, getAllJobs } from "../_services/job";
import NERRenderer from "../_components/ner-renderer";
import Loading from "../_components/loading";

export default function JobResumePage() {
    const router = useRouter();

    // job statuses
    const [jobStatuses, setJobStatuses] = useState([]);
    const [isLoadingJobStatuses, setILoadingJobStatuses] = useState(true);
    const [jobStatusesError, setJobStatusesError] = useState("");
    // uploaded resumes
    const [uploadedResumes, setUploadedResumes] = useState([]);
    const [isLoadingResumes, setIsLoadingResumes] = useState(true);
    const [resumeError, setResumeError] = useState("");
    // uploaded jobs
    const [uploadedJobs, setUploadedJobs] = useState([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);
    const [jobsError, setJobsError] = useState("");
    // selected resume
    const [selectedResume, setSelectedResume] = useState(null);
    // selected job
    const [selectedJob, setSelectedJob] = useState(null);
    // job detail fields
    const [jobDetails, setJobDetails] = useState({
        title: "",
        company: "",
        link: "",
        applicationStatus: 1,
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
    // job-resume matching result
    const [isLoadingResult, setIsLoadingResult] = useState(false);
    const [analyseError, setAnalyseError] = useState("");

    useEffect(() => {
        const fetchResumes = async () => {
            setIsLoadingResumes(true);
            try {
                const response = await getResumes();
                console.log(response)
                setUploadedResumes(response);
            } catch (error) {
                setResumeError("Failed to fetch resumes");
            } finally {
                setIsLoadingResumes(false);
            }
        };
        const fetchJobs = async () => {
            setIsLoadingJobs(true);
            try {
                const response = await getAllJobs();
                console.log(response)
                setUploadedJobs(response);
            } catch (error) {
                setJobsError("Failed to fetch jobs");
            } finally {
                setIsLoadingJobs(false);
            }
        };
        const fetchJobStatuses = async () => {
            setILoadingJobStatuses(true);
            try {
                const response = await getJobStatuses();
                console.log(response)
                setJobStatuses(response);
            } catch (error) {
                setJobStatusesError("Failed to fetch job statuses")
            } finally {
                setILoadingJobStatuses(false);
            }
        };
        fetchResumes();
        fetchJobs();
        fetchJobStatuses();
    }, []);

    const handleJobChange = (event) => {
        const jobId = event.target.value;

        if (jobId === -1) {
            const updatedJobDetails = {
                title: "",
                company: "",
                link: "",
                applicationStatus: jobDetails.applicationStatus,
                jobDesc: "",
            };
            setJobsError("");
            setJobDetails(updatedJobDetails);
            setSelectedJob(null);
            return;
        }
        const job = uploadedJobs.find((j) => j.job_id === jobId);
        const updatedJobDetails = {
            title: job.job_title,
            company: job.company_name,
            link: job.job_link,
            applicationStatus: jobDetails.applicationStatus,
            jobDesc: job.job_desc,
        };

        setErrors({
            ...errors,
            title: false,
            company: false,
            link: false,
            jobDesc: false,
        });
        setJobsError("");
        setJobDetails(updatedJobDetails);
        setSelectedJob(job);
    };

    const handleResumeChange = (event) => {
        const resumeId = event.target.value;
        const resume = uploadedResumes.find((r) => r.resume_id === resumeId);
        setResumeError("");
        setErrors({ ...errors, resume: false });
        setSelectedResume(resume);
        setAnalyseError("");
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setJobDetails({ ...jobDetails, [name]: value });
        setErrors({ ...errors, [name]: false });
        setAnalyseError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {
            resume: !selectedResume,
            title: !jobDetails.title.trim(),
            company: !jobDetails.company.trim(),
            link: !jobDetails.link.trim(),
            applicationStatus: !jobDetails.applicationStatus,
            jobDesc: !jobDetails.jobDesc.trim(),
        };

        setErrors(newErrors);

        if (Object.values(newErrors).every((error) => !error)) {
            try {
                setIsLoadingResult(true);
                const data = {
                    job_id: selectedJob ? selectedJob.job_id : null,
                    resume_id: selectedResume.resume_id,
                    job_title: jobDetails.title,
                    job_link: jobDetails.link,
                    company_name: jobDetails.company,
                    application_status: jobDetails.applicationStatus,
                    job_desc: jobDetails.jobDesc,
                };
                console.log(data)
                const newJobResume = await addJobResume(data);
                console.log(newJobResume);
                setIsLoadingResult(false);
                router.push(`/job-resume/result?job_resume_id=${newJobResume.job_resume_id}`);
            } catch (error) {
                setIsLoadingResult(false);
                setAnalyseError(error.message);
            }
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
                    <FormControl fullWidth sx={{ mb: 2 }} error={resumeError}>
                        <InputLabel>Select a Resume</InputLabel>
                        <Select
                            value={selectedResume ? selectedResume.resume_id : ""}
                            onChange={handleResumeChange}
                            label="Select a Resume"
                        >
                            {!isLoadingResumes && uploadedResumes.map((resume) => (
                                <MenuItem key={resume.resume_id} value={resume.resume_id}>
                                    {resume.resume_name}
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
                        <Box mb={4}>
                            <Typography variant="h5" gutterBottom>
                                Named Entity Recognition
                            </Typography>
                            <Card variant="outlined" sx={{ backgroundColor: "#F5F5F5" }}>
                                <CardContent>
                                    {selectedResume.ner_prediction
                                        ? <NERRenderer
                                            text={selectedResume.resume_text}
                                            entities={selectedResume.ner_prediction} />
                                        : <Typography>{selectedResume.resume_text}</Typography>
                                    }
                                </CardContent>
                            </Card>
                        </Box>
                    )}
                </Box>

                <Box mb={4} sx={{ mx: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Job Application Status
                    </Typography>
                    <FormControl fullWidth error={jobStatusesError || errors.applicationStatus}>
                        <InputLabel>Application Status</InputLabel>
                        <Select
                            name="applicationStatus"
                            value={jobDetails.applicationStatus}
                            onChange={handleInputChange}
                            label="Application Status"
                        >
                            {!isLoadingJobStatuses && jobStatuses.map((value) => (
                                <MenuItem key={value.status_id} value={value.status_id}>
                                    {value.status_name}
                                </MenuItem>
                            ))}
                        </Select>
                        {jobStatusesError && (
                            <FormHelperText sx={{ color: "error.main" }}>
                                Failed to fetch job statuses
                            </FormHelperText>
                        )}
                        {errors.applicationStatus && (
                            <FormHelperText sx={{ color: "error.main" }}>
                                Application status is required
                            </FormHelperText>
                        )}
                    </FormControl>
                </Box>

                {/* Job Section */}
                <Box mb={4} sx={{ mx: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Job Details
                    </Typography>
                    <FormControl fullWidth sx={{ mr: 2, mb: 2 }} error={jobsError}>
                        <InputLabel>Select a Job</InputLabel>
                        <Select
                            value={selectedJob ? selectedJob.job_id : -1}
                            onChange={handleJobChange}
                            label="Select a Job"
                        >
                            <MenuItem value={-1}>Add a new job</MenuItem>
                            {!isLoadingJobs && uploadedJobs.map((job) => (
                                <MenuItem key={job.job_id} value={job.job_id}>
                                    {job.job_title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Grid container sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Job Title"
                                name="title"
                                value={jobDetails.title}
                                onChange={handleInputChange}
                                fullWidth
                                error={errors.title}
                                helperText={errors.title && "Job title is required"}
                                disabled={selectedJob}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Company"
                                name="company"
                                value={jobDetails.company}
                                onChange={handleInputChange}
                                fullWidth
                                error={errors.company}
                                helperText={errors.company && "Company name is required"}
                                disabled={selectedJob}
                            />
                        </Grid>
                    </Grid>
                    
                    <Grid container sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="Job Link"
                                name="link"
                                value={jobDetails.link}
                                onChange={handleInputChange}
                                fullWidth
                                error={errors.link}
                                helperText={errors.link && "Job link is required"}
                                disabled={selectedJob}
                            />
                        </Grid>
                    </Grid>

                    <Grid sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Job Description"
                                name="jobDesc"
                                value={jobDetails.jobDesc}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                minRows={4}
                                error={errors.jobDesc}
                                helperText={errors.jobDesc && "Job description is required"}
                                disabled={selectedJob}
                            />
                        </Grid>
                    </Grid>
                    {analyseError && <FormHelperText error>{analyseError}</FormHelperText>}
                </Box>

                <Box textAlign="center">
                    <Button type="submit" variant="contained" color="primary">
                        Analyse
                    </Button>
                </Box>
            </form>
            {isLoadingResult && <Loading text="Analysing..." />}
        </div>
    );
}