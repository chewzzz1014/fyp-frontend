"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button, Snackbar, Alert } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { getAllJobResumes } from "../_services/job-resume";
import { getJobStatuses } from "../_services/job";
import { updateJobApplicationStatus } from "../_services/job-resume";
import { formatJobResumeScore, getColumnColor } from "@/app/_utils/job-resume";
import CardInfo from "./card-info";
import Loading from "./loading";
import FilterDashboard from "./filter-dashboard";

export default function Dashboard() {
    const router = useRouter();

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
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
                setData(response);
                setFilteredData(response); // Initially show all data
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
                setJobStatuses(response);
            } catch (error) {
                setError("Failed to fetch job statuses");
            } finally {
                setIsLoadingJobStatuses(false);
            }
        };
        fetchAllJobResumes();
        fetchJobStatuses();
    }, []);

    const handleFilterChange = (filters) => {
        // aspect -> filtering category
        // scoreComparison and scoreValue for filter score
        // matchType and value for others
        const { aspect, matchType, scoreComparison, scoreValue, value } = filters;

        if (aspect === "jobResumeScore") {
            const parsedValue = parseFloat(scoreValue)
            
            if (isNaN(parsedValue)) {
                setFilteredData(data);
                return;
            }

            const filtered = data.filter((jobResume) => {
                if (scoreComparison === "greater") {
                    return jobResume.job_resume_score*100 > parsedValue;
                } else if (scoreComparison === "smaller") {
                    return jobResume.job_resume_score*100 < parsedValue;
                } else if (scoreComparison === "equal") {
                    return (jobResume.job_resume_score*100).toFixed(2) === parsedValue.toFixed(2);
                }
                return false;
            });

            setFilteredData(filtered);
            return;
        }

        if (value.trim() === "") {
            setFilteredData(data);
            return;
        }

        const filtered = data.filter((jobResume) => {
            const targetValue = (() => {
                if (aspect === "resumeName") return jobResume.resume.resume_name;
                if (aspect === "companyName") return jobResume.job.company_name;
                if (aspect === "jobTitle") return jobResume.job.job_title;
                return "";
            })();

            if (matchType === "exact") {
                return targetValue.toLowerCase() === value.toLowerCase();
            } else if (matchType === "ambiguous") {
                return targetValue.toLowerCase().includes(value.toLowerCase());
            }

            return false;
        });

        setFilteredData(filtered);
    };

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
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceStatusId = parseInt(source.droppableId, 10);
        const destinationStatusId = parseInt(destination.droppableId, 10);

        if (isNaN(sourceStatusId) || isNaN(destinationStatusId)) {
            console.error("Invalid droppableId:", source.droppableId, destination.droppableId);
            return;
        }

        const sourceItems = filteredData.filter(jobResume => jobResume.application_status === sourceStatusId);
        const destinationItems = filteredData.filter(jobResume => jobResume.application_status === destinationStatusId);

        const [movedItem] = sourceItems.splice(source.index, 1);
        movedItem.application_status = destinationStatusId;
        destinationItems.splice(destination.index, 0, movedItem);

        const updatedData = filteredData.map(jobResume => {
            if (jobResume.job_resume_id === movedItem.job_resume_id) {
                return movedItem;
            }
            return jobResume;
        });

        setFilteredData(updatedData);

        try {
            await updateJobApplicationStatus({
                job_resume_id: movedItem.job_resume_id,
                new_status: movedItem.application_status
            });
        } catch (error) {
            setError("Failed to update job application status in database");
        }
    };

    return (
        <div className="min-h-screen p-8">
            {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
                    <Alert onClose={() => setError("")} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            )}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ExploreIcon />}
                    onClick={handleExploreNowClick}
                >
                    Explore Now
                </Button>
            </div>

            {/* Filter Component */}
            <FilterDashboard onFilterChange={handleFilterChange} />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
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
                                        {filteredData.filter(ele => ele.application_status === status.status_id).map((jobResume, index) => (
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
                                                            <span className="font-bold rounded text-lg p-1 bg-blue-100 text-blue-500">
                                                                {formatJobResumeScore(jobResume.job_resume_score)}%
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mb-2 truncate">{jobResume.job.company_name}</p>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            Used <span className="font-semibold">{jobResume.resume.resume_name}</span>
                                                        </p>
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
            {isLoadingData && <Loading text="Fetching data..." />}
        </div>
    );
}