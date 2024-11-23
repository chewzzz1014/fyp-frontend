// "use client";

// import React, { useState } from "react";
// import {
//     Box,
//     Typography,
//     TextField,
//     MenuItem,
//     Button,
//     Select,
//     FormControl,
//     InputLabel,
//     Card,
//     CardContent,
//     FormHelperText,
//     Grid
// } from "@mui/material";
// import { resume_text_1, resume_text_2 } from "../_constants/resume";

// export default function ResumePage() {
//     // Sample resumes
//     const uploadedResumes = [
//         { id: 1, name: "Resume 1", content: resume_text_1 },
//         { id: 2, name: "Resume 2", content: resume_text_2 },
//     ];

//     // State for resume selection and preview
//     const [selectedResume, setSelectedResume] = useState(null);

//     // Handle resume selection
//     const handleResumeChange = (event) => {
//         const resumeId = event.target.value;
//         const resume = uploadedResumes.find((r) => r.id === resumeId);
//         setSelectedResume(resume);
//     };

//     return (
//         <div className="min-h-screen p-8">
//             <h1 className="text-3xl font-bold mb-8">Job-Resume Matching Evaluation</h1>

//             <Box mb={4} sx={{ mx: 4 }}>
//                 <Typography variant="h5" gutterBottom>
//                     Resume
//                 </Typography>
//                 <FormControl fullWidth sx={{ mb: 2 }}>
//                     <InputLabel>Select a Resume</InputLabel>
//                     <Select
//                         value={selectedResume ? selectedResume.id : ""}
//                         onChange={handleResumeChange}
//                         label="Select a Resume"
//                     >
//                         {uploadedResumes.map((resume) => (
//                             <MenuItem key={resume.id} value={resume.id}>
//                                 {resume.name}
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>
//             </Box>

//             {
//                 selectedResume && (
//                     <Box mb={4} sx={{ mx: 4 }}>
//                         <Typography variant="h5" gutterBottom>
//                             Named Entity Recognition
//                         </Typography>
//                         <Card variant="outlined">
//                             <CardContent>
//                                 <Typography variant="subtitle1">
//                                     <strong>Preview:</strong>
//                                 </Typography>
//                                 <Typography>{selectedResume.content}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Box>
//                 )
//             }
//         </div>
//     );
// }
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
    IconButton
} from "@mui/material";
import { resume_text_1, resume_text_2 } from "../_constants/resume";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from 'next/navigation';

export default function ResumePage() {
    // Sample resumes
    const uploadedResumes = [
        { id: 1, name: "Resume 1", content: resume_text_1 },
        { id: 2, name: "Resume 2", content: resume_text_2 },
    ];

    // State for resume selection, preview, and file upload
    const [selectedResume, setSelectedResume] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const router = useRouter();

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
            // Mock file processing and add to resumes
            const newResume = {
                id: uploadedResumes.length + 1,
                name: uploadedFile.name,
                content: "Content extracted from uploaded resume (mock content)", // Replace with actual PDF parsing logic
            };
            uploadedResumes.push(newResume);
            setFile(uploadedFile);
            setError("");
            setSelectedResume(newResume);
            // router.refresh(); // Refresh the page to reflect the newly uploaded resume in selection
        } else {
            setError("Please upload a valid PDF file.");
        }
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">Job-Resume Matching Evaluation</h1>

            <Box mb={4} sx={{ mx: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Resume
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl fullWidth sx={{ mr: 2 }}>
                        <InputLabel>Select a Resume</InputLabel>
                        <Select
                            value={selectedResume ? selectedResume.id : ""}
                            onChange={handleResumeChange}
                            label="Select a Resume"
                        >
                            {uploadedResumes.map((resume) => (
                                <MenuItem key={resume.id} value={resume.id} selected={selectedResume ? selectedResume.id === resume.id : false}>
                                    {resume.name}
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
                <Box mb={4} sx={{ mx: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Named Entity Recognition
                    </Typography>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1">
                                <strong>Preview:</strong>
                            </Typography>
                            <Typography>{selectedResume.content}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </div>
    );
}
