import { JOB_APPLICATION_STATUS_COLOURS } from "../_constants/job";

export const formatJobResumeScore = (score) => {
    return (Math.max(score, 0) * 100).toFixed(2);
}

export const getJobStatusName = (jobStatuses, status_id) => {
    const status = jobStatuses.find(ele => ele.status_id === status_id);
    return status ? status.status_name : "INVALID JOB STATUS";
}

export const getColumnColor = (status_id) => {
    return JOB_APPLICATION_STATUS_COLOURS[status_id];
};

export function getScoreColor(score) {
    // Define maximum score for normalization (adjust as needed)
    const maxScore = 100;

    // Ensure score is within the valid range [0, maxScore]
    const clampedScore = Math.max(0, Math.min(score, maxScore));

    // Apply scaling (square root for smoother distribution)
    const normalizedScore = Math.sqrt(clampedScore / maxScore);

    // Base color (e.g., DodgerBlue)
    const baseColor = [30, 144, 255]; // RGB for DodgerBlue

    // Compute dynamic color by multiplying each channel by the normalized score
    const dynamicColor = baseColor.map((channel) =>
        Math.floor(channel * normalizedScore)
    );

    // Return the color in CSS RGB format
    return `rgb(${dynamicColor.join(",")})`;
}