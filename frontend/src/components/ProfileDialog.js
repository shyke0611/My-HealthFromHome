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
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";

export default function ProfileDialog({ open, onClose }) {
  const { user } = useAuth();
  const { updateUserName, updateUserEmail, updateUserPassword } = useUser();

  const isUser = user?.role === "USER";
  const [editField, setEditField] = useState(null);
  const [showPassword, setShowPassword] = useState({ old: false, new: false });

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
      if (field === "firstName" || field === "lastName") {
        await updateUserName({ firstName: formData.firstName, lastName: formData.lastName });
      } else if (field === "email") {
        await updateUserEmail({ newEmail: formData.email });
      } else if (field === "password") {
        await updateUserPassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
      }

      setEditField(null);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleCancel = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: user[field] || "",
      ...(field === "password" && { oldPassword: "", newPassword: "" }),
    }));
    setEditField(null);
    setShowPassword({ old: false, new: false }); // Reset password visibility when cancelling
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        {/* Avatar and User Info */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Avatar sx={{ width: 80, height: 80, margin: "auto" }}>
            {user?.firstName?.charAt(0)}
          </Avatar>
          <Typography variant="h6">{user?.firstName} {user?.lastName}</Typography>
          <Typography variant="subtitle1" color="textSecondary">{user?.role}</Typography>
        </div>

        <Divider sx={{ margin: "10px 0" }} />

        {/* First Name */}
        <Typography variant="subtitle1">First Name</Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            name="firstName"
            fullWidth
            margin="dense"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isUser || editField !== "firstName"}
          />
          {isUser && (
            editField === "firstName" ? (
              <>
                <IconButton onClick={() => handleSave("firstName")}>
                  <CheckIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => handleCancel("firstName")}>
                  <CloseIcon color="error" />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={() => setEditField("firstName")}>
                <EditIcon />
              </IconButton>
            )
          )}
        </div>

        {/* Last Name */}
        <Typography variant="subtitle1">Last Name</Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            name="lastName"
            fullWidth
            margin="dense"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!isUser || editField !== "lastName"}
          />
          {isUser && (
            editField === "lastName" ? (
              <>
                <IconButton onClick={() => handleSave("lastName")}>
                  <CheckIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => handleCancel("lastName")}>
                  <CloseIcon color="error" />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={() => setEditField("lastName")}>
                <EditIcon />
              </IconButton>
            )
          )}
        </div>

        {/* Email */}
        <Typography variant="subtitle1">Email</Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            name="email"
            type="email"
            fullWidth
            margin="dense"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isUser || editField !== "email"}
          />
          {isUser && (
            editField === "email" ? (
              <>
                <IconButton onClick={() => handleSave("email")}>
                  <CheckIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => handleCancel("email")}>
                  <CloseIcon color="error" />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={() => setEditField("email")}>
                <EditIcon />
              </IconButton>
            )
          )}
        </div>

        {/* Password Section (Only for USERS) */}
        {isUser && (
          <>
            <Divider sx={{ margin: "10px 0" }} />
            <Typography variant="h6" sx={{ marginBottom: "5px" }}>Change Password</Typography>

            {/* Old Password */}
            <Typography variant="subtitle1">Old Password</Typography>
            <TextField
              name="oldPassword"
              type={showPassword.old ? "text" : "password"}
              fullWidth
              margin="dense"
              value={formData.oldPassword}
              onChange={handleInputChange}
              disabled={editField !== "password"}
              InputProps={{
                endAdornment: editField === "password" && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => ({ ...prev, old: !prev.old }))}>
                      {showPassword.old ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* New Password */}
            <Typography variant="subtitle1">New Password</Typography>
            <TextField
              name="newPassword"
              type={showPassword.new ? "text" : "password"}
              fullWidth
              margin="dense"
              value={formData.newPassword}
              onChange={handleInputChange}
              disabled={editField !== "password"}
              InputProps={{
                endAdornment: editField === "password" && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}>
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Edit Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              {editField === "password" ? (
                <>
                  <IconButton onClick={() => handleSave("password")}>
                    <CheckIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleCancel("password")}>
                    <CloseIcon color="error" />
                  </IconButton>
                </>
              ) : (
                <IconButton onClick={() => setEditField("password")}>
                  <EditIcon />
                </IconButton>
              )}
            </div>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
