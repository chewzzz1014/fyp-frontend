"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Divider,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { getJobResume } from "@/app/_services/job-resume";
import { formatJobResumeScore } from "@/app/_utils/job-resume";
import NERRenderer from "@/app/_components/ner-renderer";
import Loading from "@/app/_components/loading";

export default function JobResumeMatchingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [jobResumeId, setJobResumeId] = useState(searchParams.get("job_resume_id"));
    const [jobResume, setJobResume] = useState(null);
    const [error, setError] = useState("");
    const [matchingScore, setMatchingScore] = useState(0.00);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const response = await getJobResume(jobResumeId);
                setJobResume(response);
            } catch (error) {
                setError("Failed to fetch job-resume");
            }
        };
        fetchResumes();
    }, [jobResumeId]);

    const handleDoneClick = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        router.push("/dashboard");
    };

    if (error) {
        return <div className="min-h-screen p-8">
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
                <Alert onClose={() => setError("")} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div>;
    }

    if (!jobResume) {
        return <Loading text="Fetching data for you..." />;
    }

    const { resume, job, job_resume_score } = jobResume;
    const resumeSkills = resume.ner_prediction ? resume.ner_prediction.filter(ele => ele.label === 'SKILL') : [];
    const jobSkills = job.ner_prediction ? job.ner_prediction.filter(ele => ele.label === 'SKILL') : [];
    console.log(jobResume)
    const formattedJobResumeScore = formatJobResumeScore(job_resume_score);

    return (
        <div className="min-h-screen p-8">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4, mx: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Resume
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDoneClick}
                >
                    Done
                </Button>
            </Box>

            {/* Skills and Matching Score Section */}
            <Paper elevation={3} sx={{ pb: 4, mb: 2, mx: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Resume Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {resumeSkills.map((skill, index) => (
                                <Chip key={index} label={skill.text} color="primary" />
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Job Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {jobSkills.map((skill, index) => (
                                <Chip key={index} label={skill.text} color="secondary" />
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box textAlign="center">
                    {matchingScore !== null && (
                        <Typography variant="h6">
                            Matching Score: {formattedJobResumeScore}%
                        </Typography>
                    )}
                </Box>
            </Paper>

            {/* Resume Section */}
            <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: "8px",
                padding: "10px",
                p: 3,
            }}>
                <Grid item xs={12} md={6} sx={{ flex: "1" }}>
                    <Card variant="outlined" sx={{ backgroundColor: "#F5F5F5" }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom className="text-black">
                                Resume
                            </Typography>
                            {resume.ner_prediction
                                ? <NERRenderer
                                    text={resume.resume_text}
                                    entities={resume.ner_prediction} />
                                : <Typography>{resume.resume_text}</Typography>
                            }
                        </CardContent>
                    </Card>
                </Grid>

                {/* Job Description Section */}
                <Grid item xs={12} md={6} sx={{ flex: "1" }}>
                    <Card variant="outlined" sx={{ backgroundColor: "#F5F5F5" }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom className="text-black">
                                Job Description
                            </Typography>
                            {job.ner_prediction
                                ? <NERRenderer
                                    text={job.job_desc}
                                    entities={job.ner_prediction} />
                                : <Typography>{job.job_desc}</Typography>
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Box>

            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                fullWidth
            >
                <DialogTitle>Result Saved Successfully</DialogTitle>
                <DialogContent>
                    <Typography>
                        Job-resume matching result has been saved. You can now view it in the dashboard!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}