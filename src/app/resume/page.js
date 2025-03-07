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
    Snackbar,
    Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { uploadResume, getResumes } from "../_services/resume";
import NERRenderer from "../_components/ner-renderer";
import Loading from "../_components/loading";

export default function ResumePage() {
    const PDF_MAX_SIZE = 200 * 1024; // 200 KB

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
        try {
            const uploadedFile = event.target.files[0];
            console.log(uploadedFile)
            if (!uploadedFile || uploadedFile.type !== "application/pdf") {
                setError("Please upload a valid PDF file.");
                return;
            }

            if (uploadedFile.size > PDF_MAX_SIZE) {
                setError('The file size must be smaller than or equal to 200 KB.');
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
            console.log(data)
            const newResume = {
                resume_id: data.resume_id,
                resume_name: resumeName,
                resume_text: data.resume_text,
                ner_prediction: data.ner_prediction || [],
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
            <h1 className="text-3xl font-bold mb-8">My Resumes</h1>
            <Box mb={4}>
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
            {isLoadingSubmit && <Loading text="Analyzing your resume..." />}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
                <Alert onClose={() => setError("")} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}