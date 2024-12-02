import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import { getJobStatusName } from "@/app/_utils/job-resume";
import NERRenderer from "./ner-renderer";

export default function CardInfo({ openModal, handleCloseModal, selectedJobResume, jobStatuses }) {
    return <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
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
}