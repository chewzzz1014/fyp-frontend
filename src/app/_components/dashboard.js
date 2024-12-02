"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
    Button,
    Snackbar,
    Alert
} from "@mui/material";
import ExploreIcon from '@mui/icons-material/Explore';
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { getAllJobResumes } from "../_services/job-resume";
import { getJobStatuses, updateJobApplicationStatus } from "../_services/job";
import { formatJobResumeScore, getColumnColor } from "@/app/_utils/job-resume";
import CardInfo from "./card-info";
import Loading from "./loading";

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
        router.push("/job-resume");
    };

    const handleCardClick = (jobResume) => {
        setSelectedJobResume(jobResume);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedJobResume(null);
    };

    const onDragEnd = async (result) => {
        const { destination, source } = result;

        // If no destination, exit
        if (!destination) return;

        // If the item is dropped back in the same position, exit
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Parse droppableId to find the source and destination statuses
        const sourceStatusId = parseInt(source.droppableId, 10);
        const destinationStatusId = parseInt(destination.droppableId, 10);

        if (isNaN(sourceStatusId) || isNaN(destinationStatusId)) {
            console.error('Invalid droppableId:', source.droppableId, destination.droppableId);
            return;
        }

        // Get the source and destination job resumes
        const sourceItems = data.filter(jobResume => jobResume.job.application_status === sourceStatusId);
        const destinationItems = data.filter(jobResume => jobResume.job.application_status === destinationStatusId);

        // Extract the moved item from the source
        const [movedItem] = sourceItems.splice(source.index, 1);

        // Update the application status of the moved item
        movedItem.job.application_status = destinationStatusId;

        // Insert the moved item into the destination
        destinationItems.splice(destination.index, 0, movedItem);

        // Update the main data array
        const updatedData = data.map(jobResume => {
            if (jobResume.job_resume_id === movedItem.job_resume_id) {
                return movedItem; // Replace with the updated item
            }
            return jobResume;
        });

        setData(updatedData);

        try {
            await updateJobApplicationStatus({
                job_id: movedItem.job.job_id,
                new_status: movedItem.job.application_status
            })
        } catch (error) {
            setError("Failed to update job application status in database");
        }
    };

    return (
        <div className="min-h-screen p-8">
            {
                error &&
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
                    <Alert onClose={() => setError("")} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            }
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Job Application Status</h1>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ExploreIcon />}
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
                                    className={`${getColumnColor(status.status_id - 1)} p-4 rounded-lg w-full`}
                                >
                                    <h2 className="text-lg font-semibold">
                                        {status.status_name.charAt(0).toUpperCase() + status.status_name.slice(1)}
                                    </h2>
                                    <div className="space-y-4 mt-4">
                                        {data.filter(ele => ele.job.application_status === status.status_id).map((jobResume, index) => (
                                            <Draggable key={jobResume.job_resume_id} draggableId={`${jobResume.job_resume_id}`} index={index}>
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

            <CardInfo
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                selectedJobResume={selectedJobResume}
                jobStatuses={jobStatuses}
            />
            {isLoadingData && <Loading text="Analysing..." />}
        </div>
    );
}