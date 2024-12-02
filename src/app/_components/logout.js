import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { logout } from "../_services/auth";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Stack,
    IconButton
} from "@mui/material";
import { useColorScheme } from '@mui/material/styles';
import { ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import LogoutIcon from '@mui/icons-material/Logout';

export default function LogoutButton() {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleLogout = () => {
        setIsDialogOpen(false);
        logout();
        router.push("/login");
    };

    const toggleMenu = () => setIsDialogOpen(!isDialogOpen);

    return (
        <React.Fragment>
            <Stack direction="row">
                <ThemeSwitcher />
                <div>
                    <IconButton type="button" aria-label="settings" onClick={toggleMenu}>
                        <LogoutIcon />
                    </IconButton>
                </div>
            </Stack>
            {
                isDialogOpen && <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1200,
                        flexDirection: "column",
                    }}
                >
                    <Dialog
                        open={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        fullWidth
                        sx={{
                            "& .MuiDialog-paper": {
                                maxWidth: "500px",
                                padding: "10px"
                            },
                        }}
                    >
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogContent>
                            Are you sure you want to log out?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsDialogOpen(false)} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={handleLogout} color="primary">
                                Logout
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            }
        </React.Fragment>
    );
}