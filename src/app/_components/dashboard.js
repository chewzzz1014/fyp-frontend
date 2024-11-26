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

// Define the statuses in an array, including "wished"
const statuses = ["wished", "applied", "interviewing", "offer", "rejected"];

// Initial job application data
const initialData = [
    { id: "1", position: "Software Engineer", company: "Company A", link: "https://company-a.com", score: 75, status: "applied", jobDesc: job_desc },
    { id: "2", position: "Data Scientist", company: "Company B", link: "https://company-b.com", score: 80, status: "applied", jobDesc: job_desc },
    { id: "3", position: "Frontend Developer", company: "Company C", link: "https://company-c.com", score: 90, status: "interviewing", jobDesc: job_desc },
    { id: "4", position: "Backend Engineer", company: "Company D", link: "https://company-d.com", score: 85, status: "offer", jobDesc: job_desc },
    { id: "5", position: "UX Designer", company: "Company E", link: "https://company-e.com", score: 70, status: "rejected", jobDesc: job_desc },
    { id: "6", position: "UX Designer", company: "Company E", link: "https://company-e.com", score: 70, status: "wished", jobDesc: job_desc },
    { id: "7", position: "UX Designer", company: "Company E", link: "https://company-e.com", score: 70, status: "wished", jobDesc: job_desc },
    { id: "8", position: "UX Designer", company: "Company E", link: "https://company-e.com", score: 70, status: "wished", jobDesc: job_desc },
    { id: "9", position: "UX Designer", company: "Company E", link: "https://company-e.com", score: 70, status: "wished", jobDesc: job_desc },
    { id: "10", position: "UX Designer", company: "Company E", link: "https://company-e.com", score: 70, status: "wished", jobDesc: job_desc },
];

export default function Dashboard() {
    const router = useRouter();
    const [data, setData] = useState({
        wished: initialData.filter((job) => job.status === "wished"),
        applied: initialData.filter((job) => job.status === "applied"),
        interviewing: initialData.filter((job) => job.status === "interviewing"),
        offer: initialData.filter((job) => job.status === "offer"),
        rejected: initialData.filter((job) => job.status === "rejected"),
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

        // If there's no destination (dropped outside), do nothing
        if (!destination) return;

        // If the destination is the same as the source, no action is needed
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Get the source and destination columns
        const start = [...data[source.droppableId]]; // Use spread to avoid mutating the state directly
        const end = [...data[destination.droppableId]];

        // Find the dragged card
        const [movedCard] = start.splice(source.index, 1); // Remove the card from the source list

        // Insert the moved card at the destination position
        end.splice(destination.index, 0, movedCard);

        // Update the state without modifying other items in the destination column
        setData({
            ...data,
            [source.droppableId]: start, // Source column after removing the card
            [destination.droppableId]: end, // Destination column with the moved card
        });
    };

    // Function to get the color for each status
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
            case "wished":
                return "bg-purple-100"; // Purple for the "Wished" section
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
                {/* Wished Section: Placed on top with 4-column layout and background color */}
                <div className="mb-8">
                    <Droppable key="wished" droppableId="wished" direction="horizontal">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-purple-100 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                            >
                                <h2 className="col-span-4 text-lg font-semibold">Wished</h2>
                                {data.wished.map((job, index) => (
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
                                                    onClick={() => handleCardClick(job)} // Modal still opens on card click
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
                        )}
                    </Droppable>
                </div>

                {/* Other Sections: Applied, Interviewing, Offer, Rejected */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statuses.slice(1).map((status) => (
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

            {/* Modal for job details */}
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
