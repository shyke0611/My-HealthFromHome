import React, { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import authAnimation from "../assets/animations/auth.json";
import logo from "../assets/images/icon.png";
import "../assets/styles/authform.css";

export default function AuthForm({
  title,
  fields,
  buttonText,
  onSubmit,
  linkText,
  linkTo,
  linkMessage,
  extraLinkText,
  extraLinkOnClick,
  enabled,
  loading,
  onGoogleLogin,
}) {
  const [showPassword, setShowPassword] = useState(false);

  
  useEffect(() => {
    if (title === "Login" && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: onGoogleLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [title, onGoogleLogin]);
  
  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    fields.forEach((field) => {
      data[field.name] = formData.get(field.name);
    });
    onSubmit(data);
  };

  return (
    <Container maxWidth="lg">
      <Lottie animationData={authAnimation} className="auth-background-animation" loop />

      <div className="auth-wrapper">
        <Box className="auth-container">
          <Box className="auth-box">
            <div className="auth-header">
              <img src={logo} alt="Logo" className="auth-logo" />
              <Typography component="h1" variant="h5" className="auth-title">
                {title}
              </Typography>
            </div>
            <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
              {fields.map((field) => (
                <TextField
                  key={field.name}
                  required
                  fullWidth
                  id={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type === "password" ? (showPassword ? "text" : "password") : field.type}
                  autoComplete={field.autoComplete}
                  autoFocus={field.autoFocus}
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

              {/* Forgot Password */}
              {extraLinkText && (
                <Typography variant="body2" className="auth-extra-link">
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      extraLinkOnClick();
                    }}
                  >
                    {extraLinkText}
                  </Link>
                </Typography>
              )}

              <Typography variant="body2" className="auth-link">
                {linkMessage} <Link to={linkTo}>{linkText}</Link>
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!enabled}
                className="auth-button"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
              </Button>

              {/* Log in with Google Button on Login Page */}
              {title === "Login" && (
                <>
                  <Divider sx={{ my: 2 }}>OR</Divider>
                  <div id="google-signin-button"></div>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </Container>
  );
}
