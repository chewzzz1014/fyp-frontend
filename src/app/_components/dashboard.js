"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { getAllJobResumes } from "../_services/job-resume";
import { getJobStatuses } from "../_services/job";
import { JOB_APPLICATION_STATUS_COLOURS } from "../_constants/job";
import { formatJobResumeScore, getJobStatusName } from "@/app/_utils/job-resume";
import NERRenderer from "./ner-renderer";

export default function Dashboard() {
    const router = useRouter();

    const [data, setData] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [jobStatuses, setJobStatuses] = useState([]);
    const [isLoadingJobStatuses, setIsLoadingJobStatuses] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedJobResume, setSelectedJobResume] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllJobResumes = async () => {
            setIsLoadingData(true);
            try {
                const response = await getAllJobResumes();
                console.log(response)
                setData(response);
            } catch (error) {
                setError("Failed to fetch data");
            } finally {
                setIsLoadingData(false);
            }
        };
        const fetchJobStatuses = async () => {
            setIsLoadingJobStatuses(true);
            try {
                const response = await getJobStatuses();
                console.log(response)
                setJobStatuses(response);
            } catch (error) {
                setError("Failed to fetch job statuses")
            } finally {
                setIsLoadingJobStatuses(false);
            }
        };
        fetchAllJobResumes();
        fetchJobStatuses();
    }, []);

    const handleExploreNowClick = () => {
        router.push("/job-resume"); // Replace with your target page path
    };

    const handleCardClick = (jobResume) => {
        setSelectedJobResume(jobResume);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedJobResume(null);
    };

    // Function to handle drag and drop
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const start = [...data[source.droppableId]];
        const end = [...data[destination.droppableId]];

        const [movedCard] = start.splice(source.index, 1);
        end.splice(destination.index, 0, movedCard);

        setData({
            ...data,
            [source.droppableId]: start,
            [destination.droppableId]: end,
        });
    };

    const getColumnColor = (status_id) => {
        return JOB_APPLICATION_STATUS_COLOURS[status_id];
    };

    return (
        <div className="min-h-screen p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Job Application Status</h1>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RocketLaunchIcon />}
                    onClick={handleExploreNowClick}
                >
                    Explore Now
                </Button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
                    {/* Render all sections in a 3-column grid */}
                    {!isLoadingJobStatuses && jobStatuses.map((status) => (
                        <Droppable key={status.status_id} droppableId={`${status.status_id}`}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`${getColumnColor(status.status_id)} p-4 rounded-lg w-full`}
                                >
                                    <h2 className="text-lg font-semibold">
                                        {status.status_name.charAt(0).toUpperCase() + status.status_name.slice(1)}
                                    </h2>
                                    <div className="space-y-4 mt-4">
                                        {data.filter(ele => ele.job.application_status === status.status_id).map((jobResume, index) => (
                                            <Draggable key={jobResume.job_resume_id} draggableId={jobResume.job_resume_id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-4 rounded-lg shadow-md relative"
                                                    >
                                                        <div className="flex justify-between items-center w-full">
                                                        <h3 className="font-bold text-lg">
                                                                {jobResume.job.job_title}
                                                            </h3>
                                                            <span className="font-bold rounded bg-blue-100 text-blue-500 text-lg p-1">
                                                                {formatJobResumeScore(jobResume.job_resume_score)}%
                                                            </span>
                                                        </div>

                                                        {/* Company name */}
                                                        <p className="text-sm text-gray-500 mb-2 truncate">{jobResume.job.company_name}</p>

                                                        {/* Resume version */}
                                                        <p className="text-sm text-gray-600 truncate">
                                                            Used <span className="font-semibold">{jobResume.resume.resume_name}</span>
                                                        </p>

                                                        {/* Add button with icon in the bottom-right corner */}
                                                        <button
                                                            onClick={() => handleCardClick(jobResume)}
                                                            className="absolute bottom-2 right-2 bg-gray-200 hover:bg-gray-300 p-1 rounded-full shadow-md"
                                                            title="View Details"
                                                        >
                                                            <RocketLaunchIcon fontSize="small" />
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
                <DialogContent className="flex gap-8">
                    <div className="w-1/2 border-r pr-8 overflow-auto">
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                    <strong>{selectedJobResume?.resume?.resume_name}</strong>
                                </Typography>
                                {selectedJobResume?.resume?.ner_prediction
                                    ? <NERRenderer
                                        text={selectedJobResume?.resume?.resume_text}
                                        entities={selectedJobResume?.resume?.ner_prediction} />
                                    : <Typography>{selectedJobResume?.resume?.resume_text}</Typography>
                                }
                            </CardContent>
                        </Card>
                    </div>
                    <div className="w-1/2 overflow-auto">
                        <h3 className="font-bold text-2xl mb-4">{selectedJobResume?.job?.job_title}</h3>
                        <div className="mb-4">
                            <p className="text-lg font-semibold">Job Link:</p>
                            <a href={selectedJobResume?.job?.job_link} target="_blank" className="text-blue-600">
                                {selectedJobResume?.job?.job_link}
                            </a>
                        </div>
                        <div className="mb-4">
                            <p className="text-lg font-semibold">Company:</p>
                            <p>{selectedJobResume?.job?.company_name}</p>
                            <p className="text-lg font-semibold mt-2">Status:</p>
                            <p className="capitalize">{getJobStatusName(jobStatuses, selectedJobResume?.job?.application_status)}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-lg font-semibold">Job Description:</p>
                            {selectedJobResume?.job?.ner_prediction
                                ? <NERRenderer
                                    text={selectedJobResume?.job?.job_desc}
                                    entities={selectedJobResume?.job?.ner_prediction} />
                                : <Typography>{selectedJobResume?.job?.job_desc}</Typography>
                            }
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {isLoadingData && (
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
                        flexDirection: "column",
                    }}
                >
                    <CircularProgress color="primary" sx={{ mb: 2 }} />
                    <Typography variant="h6" color="white">
                        Analysing...
                    </Typography>
                </Box>
            )}
        </div>
    );
}