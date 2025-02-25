import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../assets/images/icon.png";
import "../assets/styles/resetPasswordForm.css";

export default function ResetPasswordForm({ fields, onSubmit, loading }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Container className="reset-password-container">
      <Box className="reset-password-box">
        <div className="reset-header">
          <img src={logo} alt="Logo" className="reset-logo" />
          <Typography variant="h5" className="reset-title">
            Reset Your Password
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="reset-form" noValidate>
          {fields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              type={
                field.type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : field.type || "text"
              }
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!field.error}
              helperText={field.error}
              InputProps={
                field.type === "password"
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : {}
              }
            />
          ))}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="reset-button"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
