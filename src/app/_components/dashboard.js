"use client";

import { useState } from "react";
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
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resume_text_1, job_desc } from "../_constants/resume";

// Define the statuses in an array, including "interested"
const statuses = ["interested", "applied", "assessment", "interviewing", "offer", "rejected"];

// Initial job application data
const initialData = [
    { id: "1", position: "Software Engineer", company: "Company A", link: "https://company-a.com", score: 75, status: "applied", jobDesc: job_desc },
    { id: "2", position: "Data Scientist", company: "Company B", link: "https://company-b.com", score: 80, status: "applied", jobDesc: job_desc },
    { id: "3", position: "Frontend Developer", company: "Company C", link: "https://company-c.com", score: 90, status: "interviewing", jobDesc: job_desc },
    { id: "4", position: "Backend Engineer", company: "Company D", link: "https://company-d.com", score: 85, status: "offer", jobDesc: job_desc },
    { id: "5", position: "UX Designer", company: "Company E", link: "https://company-e.com", score: 70, status: "rejected", jobDesc: job_desc },
    { id: "6", position: "Product Manager", company: "Company F", link: "https://company-f.com", score: 72, status: "interested", jobDesc: job_desc },
    { id: "7", position: "DevOps Engineer", company: "Company G", link: "https://company-g.com", score: 78, status: "interested", jobDesc: job_desc },
    { id: "8", position: "Graphic Designer", company: "Creative Studio H", link: "https://studio-h.com", score: 67, status: "interested", jobDesc: job_desc },
    { id: "9", position: "Full Stack Developer", company: "Startup I", link: "https://startup-i.com", score: 85, status: "assessment", jobDesc: job_desc },
    { id: "10", position: "AI Researcher", company: "TechLab J", link: "https://techlab-j.com", score: 88, status: "assessment", jobDesc: job_desc },
];

export default function Dashboard() {
    const router = useRouter();
    const [data, setData] = useState({
        interested: initialData.filter((job) => job.status === "interested"),
        applied: initialData.filter((job) => job.status === "applied"),
        interviewing: initialData.filter((job) => job.status === "interviewing"),
        offer: initialData.filter((job) => job.status === "offer"),
        rejected: initialData.filter((job) => job.status === "rejected"),
        assessment: initialData.filter((job) => job.status === 'assessment'),
    });

    const [openModal, setOpenModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleExploreNowClick = () => {
        router.push("/job-resume"); // Replace with your target page path
    };

    const handleCardClick = (job) => {
        setSelectedJob(job);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedJob(null);
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

    const getColumnColor = (status) => {
        switch (status) {
            case "applied":
                return "bg-blue-100";
            case "interviewing":
                return "bg-yellow-100";
            case "offer":
                return "bg-green-100";
            case "rejected":
                return "bg-red-100";
            case "interested":
                return "bg-purple-100";
            case "assessment":
                return "bg-orange-100";
            default:
                return "bg-gray-100";
        }
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Render all sections in a 3-column grid */}
                    {statuses.map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`${getColumnColor(status)} p-4 rounded-lg w-full`}
                                >
                                    <h2 className="text-lg font-semibold">
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </h2>
                                    <div className="space-y-4 mt-4">
                                        {data[status].map((job, index) => (
                                            <Draggable key={job.id} draggableId={job.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-4 rounded-lg shadow-md relative"
                                                    >
                                                        {/* Job score */}
                                                        <div className="absolute top-2 right-2 font-bold px-2 py-1 rounded">
                                                            <span className="text-blue-500 text-lg sm:text-xs md:text-sm lg:text-xl">
                                                                {job.score}%
                                                            </span>
                                                        </div>

                                                        {/* Job title */}
                                                        <h3
                                                            className="font-bold text-lg mb-1 truncate"
                                                            onClick={() => handleCardClick(job)}
                                                        >
                                                            {job.position}
                                                        </h3>

                                                        {/* Company name */}
                                                        <p className="text-sm text-gray-500 mb-2 truncate">{job.company}</p>

                                                        {/* Resume version */}
                                                        <p className="text-sm text-gray-600 truncate">
                                                            Used <span className="font-semibold">Resume 1</span>
                                                        </p>

                                                        {/* Add button with icon in the bottom-right corner */}
                                                        <button
                                                            onClick={() => handleCardClick(job)}
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
                                <Typography variant="subtitle1">
                                    <strong>Resume 1</strong>
                                </Typography>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{resume_text_1}</ReactMarkdown>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="w-1/2 overflow-auto">
                        <h3 className="font-bold text-2xl mb-4">{selectedJob?.position}</h3>
                        <div className="mb-4">
                            <p className="text-lg font-semibold">Job Link:</p>
                            <a href={selectedJob?.link} target="_blank" className="text-blue-600">
                                {selectedJob?.link}
                            </a>
                        </div>
                        <div className="mb-4">
                            <p className="text-lg font-semibold">Company:</p>
                            <p>{selectedJob?.company}</p>
                            <p className="text-lg font-semibold mt-2">Status:</p>
                            <p className="capitalize">{selectedJob?.status}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-lg font-semibold">Job Description:</p>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedJob?.jobDesc}</ReactMarkdown>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}