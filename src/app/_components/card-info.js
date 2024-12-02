import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import Chip from '@mui/material/Chip';
import { getJobStatusName } from "@/app/_utils/job-resume";
import NERRenderer from "./ner-renderer";

export default function CardInfo({ openModal, handleCloseModal, selectedJobResume, jobStatuses }) {
    return <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
        <DialogContent className="flex gap-8">
            <div className="w-1/2 border-r pr-8 overflow-auto">
                <h3 className="font-bold text-2xl mb-4">{selectedJobResume?.resume?.resume_name}</h3>
                <div className="mb-4">
                    <Card variant="outlined" sx={{ backgroundColor: "#F5F5F5" }}>
                        <CardContent>
                            {selectedJobResume?.resume?.ner_prediction
                                ? <NERRenderer
                                    text={selectedJobResume?.resume?.resume_text}
                                    entities={selectedJobResume?.resume?.ner_prediction} />
                                : <Typography>{selectedJobResume?.resume?.resume_text}</Typography>
                            }
                        </CardContent>
                    </Card>
                </div>
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
                    <Chip className="capitalize" label={getJobStatusName(jobStatuses, selectedJobResume?.application_status)} color="primary" />
                </div>
                <div className="mb-4">
                    <p className="text-lg font-semibold">Job Description:</p>
                    <Card variant="outlined" sx={{ backgroundColor: "#F5F5F5" }}>
                        <CardContent>
                            {selectedJobResume?.job?.ner_prediction
                                ? <NERRenderer
                                    text={selectedJobResume?.job?.job_desc}
                                    entities={selectedJobResume?.job?.ner_prediction} />
                                : <Typography>{selectedJobResume?.job?.job_desc}</Typography>
                            }
                        </CardContent>
                    </Card>
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