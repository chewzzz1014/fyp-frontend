"use client";

import React, { useState } from "react";
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
} from "@mui/material";

export default function JobResumeMatchingPage() {
    // Sample data
    const resumeText = `
    John Doe is an experienced software engineer with expertise in developing scalable web applications. 
    He has proficiency in JavaScript, React, Node.js, and Python. Additionally, he holds certifications in cloud computing and DevOps.
  `;

    const jobDescriptionText = `
    Looking for a software engineer to develop and maintain high-quality web applications. 
    The candidate should be proficient in JavaScript, React, and have experience with REST APIs. 
    Prior knowledge of Python and DevOps practices is a plus.
  `;

    const resumeSkills = ["JavaScript", "React", "Node.js", "Python", "Cloud Computing", "DevOps"];
    const jobSkills = ["JavaScript", "React", "REST APIs", "Python", "DevOps"];

    // Placeholder for job-resume matching score
    const [matchingScore, setMatchingScore] = useState(0.00);

    // Simulate a job-resume matching function
    const calculateMatchingScore = () => {
        // Mock score calculation logic (replace with real implementation)
        const overlap = resumeSkills.filter(skill => jobSkills.includes(skill)).length;
        const score = Math.round((overlap / jobSkills.length) * 100); // Based on skill overlap
        setMatchingScore(score);
    };

    return (
        <Box className="mx-4">
           <h1 className="text-3xl font-bold mb-8 mx-8">Resume</h1>

            {/* Skills and Matching Score Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, mx:4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Resume Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {resumeSkills.map((skill, index) => (
                                <Chip key={index} label={skill} color="primary" />
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Job Description Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {jobSkills.map((skill, index) => (
                                <Chip key={index} label={skill} color="secondary" />
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box textAlign="center">
                    {matchingScore !== null && (
                        <Typography variant="h6" mt={2}>
                            Matching Score: {matchingScore}%
                        </Typography>
                    )}
                </Box>
            </Paper>

            {/* Resume and Job Description Section */}
            <Grid container spacing={4} sx={{ mx:4 }}>
                {/* Resume Section */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Resume
                            </Typography>
                            <Typography>{resumeText}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Job Description Section */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Job Description
                            </Typography>
                            <Typography>{jobDescriptionText}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
