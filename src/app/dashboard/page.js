"use client"
"use client"

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Define the statuses in an array
const statuses = ["applied", "interviewing", "offer", "rejected"];

// Initial job application data
const initialData = [
    { id: "1", position: "Software Engineer", company: "Company A", link: "https://company-a.com", score: 75, status: "applied" },
    { id: "2", position: "Data Scientist", company: "Company B", link: "https://company-b.com", score: 80, status: "applied" },
    { id: "3", position: "Frontend Developer", company: "Company C", link: "https://company-c.com", score: 90, status: "interviewing" },
    { id: "4", position: "Backend Engineer", company: "Company D", link: "https://company-d.com", score: 85, status: "offer" },
    { id: "5", position: "UX Designer", company: "Company E", link: "https://company-e.com", score: 70, status: "rejected" },
];

export default function Dashboard() {
    // Set the state for the jobs grouped by status
    const [data, setData] = useState({
        applied: initialData.filter(job => job.status === "applied"),
        interviewing: initialData.filter(job => job.status === "interviewing"),
        offer: initialData.filter(job => job.status === "offer"),
        rejected: initialData.filter(job => job.status === "rejected"),
    });

    // Function to handle drag and drop
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        // If dropped outside the board, do nothing
        if (!destination) return;

        // If the card was dropped in the same place, do nothing
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Find the source and destination arrays
        const start = data[source.droppableId];
        const end = data[destination.droppableId];

        // Find the card that was moved
        const [movedCard] = start.splice(source.index, 1);
        movedCard.status = destination.droppableId; // Update the status based on where it was dropped

        // Update the state with the new positions
        end.splice(destination.index, 0, movedCard);

        setData({
            ...data,
            [source.droppableId]: start,
            [destination.droppableId]: end,
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
            default:
                return "bg-gray-100";
        }
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">Job Application Status</h1>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 justify-around text-black">
                    {/* Iterate over the statuses array to create columns dynamically */}
                    {statuses.map(status => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`${getColumnColor(status)} p-4 rounded-lg w-1/4`}
                                >
                                    <h2 className="text-lg font-semibold">{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
                                    <div className="space-y-4 mt-4">
                                        {/* Render the job cards for each status */}
                                        {data[status].map((job, index) => (
                                            <Draggable key={job.id} draggableId={job.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-4 rounded-lg shadow-md"
                                                    >
                                                        <h3 className="font-semibold">{job.position}</h3>
                                                        <p>{job.company}</p>
                                                        <a href={job.link} target="_blank" className="text-blue-500 text-sm">Application Link</a>
                                                        <div className="mt-2 text-sm">Job-Resume Score: {job.score}%</div>
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
        </div>
    );
}
