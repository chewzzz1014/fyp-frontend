"use client";

import React, { useState, useEffect } from "react";
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
import { uploadResume, getResumes } from "../_services/resume";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.min.mjs`;

export default function ResumePage() {
    const [uploadedResumes, setUploadedResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [isLoadingResumes, setIsLoadingResumes] = useState(true);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [resumeName, setResumeName] = useState("");

    useEffect(() => {
        const fetchResumes = async () => {
            setIsLoadingResumes(true);
            try {
                const response = await getResumes();
                console.log(response)
                setUploadedResumes(response);
            } catch (error) {
                setError("Failed to fetch resumes");
            } finally {
                setIsLoadingResumes(false);
            }
        };
        fetchResumes();
    }, []);

    const handleResumeChange = (event) => {
        const resumeId = event.target.value;
        const resume = uploadedResumes.find((r) => r.resume_id === resumeId);
        setError("");
        setSelectedResume(resume);
    };

    const handleFileUpload = async (event) => {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile || uploadedFile.type !== "application/pdf") {
            setError("Please upload a valid PDF file.");
            return;
        }

        try {
            const pdf = await getDocument(URL.createObjectURL(uploadedFile)).promise;
            if (pdf.numPages > 6) {
                setError("The PDF exceeds the maximum allowed page limit of 6.");
                return;
            }
            setError("");
            setFile(uploadedFile);
            setResumeName(uploadedFile.name.replace(/\.pdf$/, ""));
            setIsDialogOpen(true);
        } catch (err) {
            console.error(err);
            setError("Failed to process the PDF file.");
        }
    };

    const handleDialogSubmit = async () => {
        setIsDialogOpen(false);
        setIsLoadingSubmit(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("resume_name", resumeName);

        try {
            const data = await uploadResume(formData);
            const newResume = {
                resume_id: data.resume_id,
                resume_name: resumeName,
                resume_text: data.resume_text,
            };
            setUploadedResumes([...uploadedResumes, newResume]);
            setSelectedResume(newResume);
            setIsSuccessOpen(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoadingSubmit(false);
            setFile(null);
            setResumeName("");
        }
    };

    const handleFileReset = () => {
        setError("");
        setFile(null);
        setResumeName("");
        setIsDialogOpen(false);
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">Resume</h1>
            <Box mb={4}>
                <Typography variant="h5" gutterBottom>
                    Resume
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormControl fullWidth sx={{ mr: 2 }}>
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
                    </FormControl>
                    <IconButton
                        color="primary"
                        onClick={() => document.getElementById("file-input").click()}
                        sx={{ backgroundColor: "#1565c0", ":hover": { backgroundColor: "#049DD9" } }}
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
            {selectedResume && (
                <Box mb={4}>
                    <Typography variant="h5" gutterBottom>
                        Named Entity Recognition
                    </Typography>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography>{selectedResume.resume_text}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            )}
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
            {isLoadingSubmit && (
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
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
                <Alert onClose={() => setError("")} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}