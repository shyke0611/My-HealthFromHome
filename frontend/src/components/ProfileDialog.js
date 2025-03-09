import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Avatar,
    IconButton,
    Divider,
    InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSnackbar } from "notistack";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";

export default function ProfileDialog({ open, onClose }) {
    const { user } = useAuth();
    const { updateUserName, updateUserEmail, updateUserPassword } = useUser();
    const { enqueueSnackbar } = useSnackbar();

    const isUser = user?.role === "USER";
    const [editField, setEditField] = useState(null);
    const [showPassword, setShowPassword] = useState({ old: false, new: false });
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        oldPassword: "",
        newPassword: "",
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (field) => {
        try {
            let response;
            if (field === "firstName" || field === "lastName") {
                response = await updateUserName({ firstName: formData.firstName, lastName: formData.lastName });
            } else if (field === "email") {
                response = await updateUserEmail({ newEmail: formData.email });

                if (response.message?.newEmail) {
                    setFormErrors((prev) => ({ ...prev, email: response.message.newEmail }));
                    return;
                }
            } else if (field === "password") {
                response = await updateUserPassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });

                if (response.message?.password) {
                    setFormErrors((prev) => ({ ...prev, oldPassword: response.message.password }));
                    return;
                }
            }

            if (response.success) {
                enqueueSnackbar(response.message, { variant: "success" });
                setEditField(null);
                setFormErrors({});

                if (field === "password") {
                    setFormData((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
                }
            } else {
                if (typeof response.message === "object") {
                    setFormErrors(response.message);
                } else {
                    enqueueSnackbar(response.message || "Update failed. Please try again.", { variant: "error" });
                }
            }
        } catch (error) {
            enqueueSnackbar("An error occurred. Please try again.", { variant: "error" });
        }
    };


    const handleCancel = (field) => {
        setFormData((prev) => ({
            ...prev,
            [field]: user[field] || "",
            ...(field === "password" && { oldPassword: "", newPassword: "" }),
        }));
        setEditField(null);
        setShowPassword({ old: false, new: false });
        setFormErrors({});
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Profile</DialogTitle>
            <DialogContent>
                {/* Avatar and general content */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Avatar sx={{ width: 80, height: 80, margin: "auto" }}>{user?.firstName?.charAt(0)}</Avatar>
                    <Typography variant="h6">{user?.firstName} {user?.lastName}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">{user?.role}</Typography>
                </div>
                <Divider sx={{ margin: "10px 0" }} />

                {/* Name and Email section */}
                {['firstName', 'lastName', 'email'].map((field) => (
                    <div key={field}>
                        <Typography variant="subtitle1">{field.charAt(0).toUpperCase() + field.slice(1)}</Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <TextField
                                name={field}
                                fullWidth
                                margin="dense"
                                value={formData[field]}
                                onChange={handleInputChange}
                                disabled={!isUser || editField !== field}
                                error={!!formErrors[field]}
                                helperText={formErrors[field]}
                            />
                            {isUser && (
                                editField === field ? (
                                    <>
                                        <IconButton onClick={() => handleSave(field)}><CheckIcon color="primary" /></IconButton>
                                        <IconButton onClick={() => handleCancel(field)}><CloseIcon color="error" /></IconButton>
                                    </>
                                ) : (
                                    <IconButton onClick={() => setEditField(field)}><EditIcon /></IconButton>
                                )
                            )}
                        </div>
                    </div>
                ))}

                {/* Password section */}
                {isUser && (
                    <>
                        <Divider sx={{ margin: "10px 0" }} />
                        <Typography variant="h6">Change Password</Typography>

                        {[{ name: "oldPassword", label: "Old Password" }, { name: "newPassword", label: "New Password" }].map(({ name, label }) => (
                            <div key={name}>
                                <Typography variant="subtitle1">{label}</Typography>
                                <TextField
                                    name={name}
                                    type={showPassword[name] ? "text" : "password"}
                                    fullWidth
                                    margin="dense"
                                    value={formData[name]}
                                    onChange={handleInputChange}
                                    disabled={editField !== "password"}
                                    error={!!formErrors[name]}
                                    helperText={formErrors[name]}
                                    InputProps={{
                                        endAdornment: editField === "password" && (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }))}>
                                                    {showPassword[name] ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        ))}

                        {/* Password Save & Cancel Buttons */}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                            {editField === "password" ? (
                                <>
                                    <IconButton onClick={() => handleSave("password")}><CheckIcon color="primary" /></IconButton>
                                    <IconButton onClick={() => handleCancel("password")}><CloseIcon color="error" /></IconButton>
                                </>
                            ) : (
                                <IconButton onClick={() => setEditField("password")}><EditIcon /></IconButton>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>

            {/* Close Dialog Button */}

            <DialogActions>
                <Button onClick={onClose} color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
    );
}
