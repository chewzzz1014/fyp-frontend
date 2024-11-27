"use client"

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { logout } from "../_services/api";

export default function LogoutPage() {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(true);

    const handleLogout = () => {
        setIsDialogOpen(false);
        logout();
        router.push("/login");
    };

    return (
        <div>
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        maxWidth: "500px",
                        padding: "20px",
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
        </div>
    );
}