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