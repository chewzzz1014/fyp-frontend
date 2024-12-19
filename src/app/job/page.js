"use client";

import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Select,
    FormControl,
    InputLabel,
    Grid,
    FormHelperText,
    IconButton,
    Card,
    CardContent,
    Tooltip
} from "@mui/material";
import { useRouter } from "next/navigation";
import PreviewIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { getAllJobs, addJob, updateJob } from "../_services/job";
import Loading from "../_components/loading";
import NERRenderer from "../_components/ner-renderer";

export default function JobPage() {
    const router = useRouter();

    const [uploadedJobs, setUploadedJobs] = useState([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);
    const [jobsError, setJobsError] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobDetails, setJobDetails] = useState({
        title: "",
        company: "",
        link: "",
        jobDesc: "",
    });
    const [errors, setErrors] = useState({
        title: false,
        company: false,
        link: false,
        jobDesc: false,
    });
    const [isLoadingResult, setIsLoadingResult] = useState(false);
    const [analyseError, setAnalyseError] = useState("");
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoadingJobs(true);
            try {
                const response = await getAllJobs();
                setUploadedJobs(response);
            } catch (error) {
                setJobsError("Failed to fetch jobs");
            } finally {
                setIsLoadingJobs(false);
            }
        };
        fetchJobs();
    }, []);

    const handleJobChange = (event) => {
        const jobId = event.target.value;

        if (jobId === -1) {
            setJobDetails({
                title: "",
                company: "",
                link: "",
                jobDesc: "",
            });
            setSelectedJob(null);
            if (isPreview) setIsPreview(false);
            return;
        }

        const job = uploadedJobs.find((j) => j.job_id === jobId);
        setJobDetails({
            title: job.job_title,
            company: job.company_name,
            link: job.job_link,
            jobDesc: job.job_desc,
        });
        setSelectedJob(job);
        setErrors({
            title: false,
            company: false,
            link: false,
            jobDesc: false,
        });
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
            title: !jobDetails.title.trim(),
            company: !jobDetails.company.trim(),
            link: !jobDetails.link.trim(),
            jobDesc: !jobDetails.jobDesc.trim(),
        };

        setErrors(newErrors);

        if (Object.values(newErrors).every((error) => !error)) {
            try {
                setIsLoadingResult(true);

                if (selectedJob) {
                    const newData = {
                        job_id: selectedJob.job_id,
                        job_title: jobDetails.title,
                        job_link: jobDetails.link,
                        company_name: jobDetails.company,
                        job_desc: jobDetails.jobDesc,
                    };
                    const updatedJob = await updateJob(newData);
                    setUploadedJobs((prevJobs) =>
                        prevJobs.map((job) =>
                            job.job_id === updatedJob.job_id ? updatedJob : job
                        )
                    );
                    setSelectedJob(updatedJob);
                } else {
                    const newData = {
                        job_title: jobDetails.title,
                        job_link: jobDetails.link,
                        company_name: jobDetails.company,
                        job_desc: jobDetails.jobDesc,
                    };
                    const addedJob = await addJob(newData);
                    setUploadedJobs((prevJobs) => [...prevJobs, addedJob]);
                    setSelectedJob(addedJob);
                }

                setIsPreview(!isPreview);
                setIsLoadingResult(false);
            } catch (error) {
                setIsLoadingResult(false);
                setAnalyseError(error.message);
            }
        }
    };

    const togglePreview = () => {
        if (!selectedJob) {
            setAnalyseError("Please select a job to preview.");
            return;
        }
        setIsPreview((prev) => !prev);
    };

    return (
        <div className="min-h-screen p-8">
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4, mr: 2 }}>
                <h1 className="text-3xl font-bold mx-8">My Jobs</h1>
                <div display="flex" alignItems="center">
                    <Tooltip title={`Switch to ${isPreview ? 'edit' : 'preview'} mode`} arrow placement="bottom">
                        <IconButton onClick={togglePreview}>
                            {isPreview ? <EditIcon /> : <PreviewIcon />}
                        </IconButton>
                    </Tooltip>
                </div>
            </Box>

            <form onSubmit={handleSubmit}>
                <Box sx={{ mx: 4, mb: 4 }}>
                    <FormControl fullWidth sx={{ mr: 2, mb: 2 }} error={Boolean(jobsError)}>
                        <InputLabel>Select a Job</InputLabel>
                        <Select
                            value={selectedJob ? selectedJob.job_id : -1}
                            onChange={handleJobChange}
                            label="Select a Job"
                        >
                            <MenuItem value={-1}>Add a new job</MenuItem>
                            {!isLoadingJobs &&
                                uploadedJobs.map((job) => (
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
                                disabled={isPreview}
                                error={errors.title}
                                helperText={errors.title && "Job title is required"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Company"
                                name="company"
                                value={jobDetails.company}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={isPreview}
                                error={errors.company}
                                helperText={errors.company && "Company name is required"}
                            />
                        </Grid>
                    </Grid>

                    <Grid container sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Job Link"
                                name="link"
                                value={jobDetails.link}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={isPreview}
                                error={errors.link}
                                helperText={errors.link && "Job link is required"}
                            />
                        </Grid>
                    </Grid>

                    <Grid sx={{ mb: 2 }}>
                        {isPreview && selectedJob ? (
                            <Card variant="outlined" sx={{ backgroundColor: "#F5F5F5" }}>
                                <CardContent>
                                    <NERRenderer
                                        text={selectedJob.job_desc}
                                        entities={selectedJob.ner_prediction} />
                                </CardContent>
                            </Card>
                        ) : (
                            <TextField
                                label="Job Description"
                                name="jobDesc"
                                value={jobDetails.jobDesc}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                minRows={4}
                                error={errors.jobDesc}
                                helperText={errors.jobDesc ? "Job description is required" : !isPreview && selectedJob && "Modifying the job description may take extra time as NER predictions will be updated."}
                            />
                        )}
                    </Grid>

                    {analyseError && <FormHelperText error>{analyseError}</FormHelperText>}
                </Box>

                {!isPreview && (
                    <Box textAlign="center">
                        <Button type="submit" variant="contained" color="primary">
                            {selectedJob ? "Update Job" : "Add Job"}
                        </Button>
                    </Box>
                )}
            </form>

            {isLoadingResult && <Loading text="Processing..." />}
        </div>
    );
}