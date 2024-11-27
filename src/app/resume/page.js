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
    Snackbar,
    Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { resume_text_1, resume_text_2 } from "../_constants/resume";
import { uploadResume } from "../_services/resume";

export default function ResumePage() {
    const [uploadedResumes, setUploadedResumes] = useState([
        { id: 1, name: "Resume 1", content: resume_text_1 },
        { id: 2, name: "Resume 2", content: resume_text_2 },
    ]);

    const [selectedResume, setSelectedResume] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [resumeName, setResumeName] = useState("");

    const handleResumeChange = (event) => {
        const resumeId = event.target.value;
        const resume = uploadedResumes.find((r) => r.id === resumeId);
        setError("");
        setSelectedResume(resume);
    };

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile && uploadedFile.type === "application/pdf") {
            setError("");
            setFile(uploadedFile);
            setResumeName(uploadedFile.name.replace(/\.pdf$/, ""));
            setIsDialogOpen(true);
        } else {
            setError("Please upload a valid PDF file.");
        }
    };

    const handleDialogSubmit = async () => {
        setIsDialogOpen(false);
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("resume_name", resumeName);

        try {
            const data = await uploadResume(formData);
            const newResume = {
                id: uploadedResumes.length + 1,
                name: resumeName,
                content: data.resume_text,
            };
            setUploadedResumes([...uploadedResumes, newResume]);
            setSelectedResume(newResume);
            setIsSuccessOpen(true);
        } catch (error) {
            setError(error.message); // Display error message
        } finally {
            setIsLoading(false);
            setFile(null); // Reset file state
            setResumeName(""); // Reset resume name state
        }
    };

    const handleFileReset = () => {
        setError(""); // Clear any previous errors
        setFile(null); // Reset file input
        setResumeName(""); // Clear the resume name field
        setIsDialogOpen(false); // Close the dialog box
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
                    {uploadedResumes.length > 0 ? (
                        <FormControl fullWidth sx={{ mr: 2 }}>
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
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
                <DialogTitle>Name Your Resume</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Resume Name"
                        fullWidth
                        value={resumeName}
                        onChange={(e) => setResumeName(e.target.value)}
                        error={!resumeName.trim()}
                        helperText={!resumeName.trim() && "Resume name is required"}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFileReset}>Cancel</Button>
                    <Button
                        onClick={handleDialogSubmit}
                        disabled={!resumeName.trim()}
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
            <Dialog open={isSuccessOpen} onClose={() => setIsSuccessOpen(false)}>
                <DialogTitle>Resume Uploaded Successfully</DialogTitle>
                <DialogContent>
                    <Typography>Explore what entities are found in your resume!</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSuccessOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Errors */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
                <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}