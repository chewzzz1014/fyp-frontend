import {
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";

export default function Loading({ text }) {
    return (
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
                zIndex: 1200,
                flexDirection: "column",
            }}
        >
            <CircularProgress color="primary" sx={{ mb: 2 }} />
            <Typography variant="h6">
                {text}
            </Typography>
        </Box>
    );
}