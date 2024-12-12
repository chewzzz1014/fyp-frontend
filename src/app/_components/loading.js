import {
    Box,
    Typography,
    CircularProgress,
    useTheme
} from "@mui/material";

export default function Loading({ text }) {
    const theme = useTheme();

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
            <Typography
                variant="h6"
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    padding: "4px 8px",
                    borderRadius: "8px",
                    textAlign: "center",
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}