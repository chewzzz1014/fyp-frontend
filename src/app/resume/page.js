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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { resume_text_1, resume_text_2 } from "../_constants/resume";

export default function ResumePage() {
    // Sample resumes
    const [uploadedResumes, setUploadedResumes] = useState([
        { id: 1, name: "Resume 1", content: resume_text_1 },
        { id: 2, name: "Resume 2", content: resume_text_2 },
    ]);

    // State for resume selection and preview
    const [selectedResume, setSelectedResume] = useState(null);

    // File upload states
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [resumeName, setResumeName] = useState("");

    // Handle resume selection
    const handleResumeChange = (event) => {
        const resumeId = event.target.value;
        const resume = uploadedResumes.find((r) => r.id === resumeId);
        setError("");
        setSelectedResume(resume);
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile && uploadedFile.type === "application/pdf") {
            setError("");
            setFile(uploadedFile);
            setResumeName(uploadedFile.name.replace(/\.pdf$/, ""));
            setIsDialogOpen(true); // Open dialog to name the resume
        } else {
            setError("Please upload a valid PDF file.");
        }
    };

    // Handle dialog submission
    const handleDialogSubmit = () => {
        setIsDialogOpen(false);
        setIsLoading(true);

        // Simulate parsing and saving to the database
        setTimeout(() => {
            const newResume = {
                id: uploadedResumes.length + 1,
                name: resumeName,
                content: "Extracted content from uploaded resume (mock content)", // Replace with actual parsing logic
            };
            setUploadedResumes([...uploadedResumes, newResume]);
            setSelectedResume(newResume);
            setIsLoading(false);
            setIsSuccessOpen(true);
        }, 2000); // Simulating a 2-second delay
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8 mx-8">Resume</h1>

            {/* Resume Selection Section */}
            <Box mb={4} sx={{ mx: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Resume
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Conditionally render Select or TextField based on if resumes are uploaded */}
                    {uploadedResumes.length > 0 ? (
                        <FormControl fullWidth sx={{ mr: 2 }}>
                            <InputLabel>Select a Resume</InputLabel>
                            <Select
                                value={selectedResume ? selectedResume.id : ""}
                                onChange={handleResumeChange}
                                label="Select a Resume"
                            >
                                {uploadedResumes.map((resume) => (
                                    <MenuItem
                                        key={resume.id}
                                        value={resume.id}
                                        selected={selectedResume ? selectedResume.id === resume.id : false}
                                    >
                                        {resume.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <TextField
                            label="No resume available. Add yours now!"
                            variant="outlined"
                            disabled
                            fullWidth
                            sx={{ mr: 2 }}
                        />
                    )}

                    {/* Button to upload a new resume */}
                    <IconButton
                        color="primary"
                        onClick={() => document.getElementById("file-input").click()}
                        sx={{
                            backgroundColor: "#1565c0",
                            ":hover": { backgroundColor: "#049DD9" },
                        }}
                    >
                        <AddIcon sx={{ color: "#ffffff" }} />
                    </IconButton>
                    <input
                        type="file"
                        id="file-input"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                    />
                </Box>
                {error && <FormHelperText error>{error}</FormHelperText>}
            </Box>

            {/* Selected Resume Content Preview */}
            {selectedResume && (
                <Box mb={4} sx={{ mx: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Named Entity Recognition
                    </Typography>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography>{selectedResume.content}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* Name Resume Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        maxWidth: "800px", // Custom width
                        padding: "20px",
                    },
                }}
            >
                <DialogTitle>Name Your Resume</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Resume Name"
                        fullWidth
                        value={resumeName}
                        onChange={(e) => setResumeName(e.target.value)}
                        error={!resumeName.trim() || uploadedResumes.some(r => r.name === resumeName.trim())}
                        helperText={
                            !resumeName.trim()
                                ? "Resume name is required"
                                : uploadedResumes.some(r => r.name === resumeName.trim())
                                    ? "Resume name must be unique"
                                    : ""
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleDialogSubmit}
                        disabled={
                            !resumeName.trim() || uploadedResumes.some(r => r.name === resumeName.trim())
                        }
                        color="primary"
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Loading Animation */}
            {isLoading && (
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
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {/* Success Popup */}
            <Dialog
                open={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
            >
                <DialogTitle>Resume Uploaded Successfully</DialogTitle>
                <DialogContent>
                    <Typography>
                        Your resume has been uploaded successfully!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSuccessOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}