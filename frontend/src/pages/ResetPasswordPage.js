import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Container, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import useAuth from "../hooks/useAuth";
import ResetPasswordForm from "../components/ResetPasswordForm";
import logo from "../assets/images/icon.png";
import "../assets/styles/resetPasswordForm.css";

export default function ResetPasswordPage() {
  const { verifyResetToken, resetPassword, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [tokenValid, setTokenValid] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const resetToken = searchParams.get("token");

  /** Verify Reset Token on mount */
  useEffect(() => {
    const verifyToken = async () => {
      const response = await verifyResetToken(resetToken);
      setTokenValid(response.success);
    };

    verifyToken();
  }, [resetToken, verifyResetToken, enqueueSnackbar]);

  const handleResetPassword = async ({ newPassword, confirmPassword }) => {
    const errors = {};

    if (!newPassword) errors.newPassword = "New password is required";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const response = await resetPassword({ token: resetToken, newPassword });

    if (response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
      navigate("/login");
    } else {
      if (typeof response.message === "object") {
        setFormErrors(response.message);
      } else {
        enqueueSnackbar(response.message || "Password reset failed.", { variant: "error" });
      }
    }
  };

  /** Loading State */
  if (tokenValid === null) {
    return (
      <Container>
        <Typography variant="h5" align="center" style={{ marginTop: "2rem" }}>
          Verifying reset token...
        </Typography>
        <CircularProgress style={{ display: "block", margin: "1rem auto" }} />
      </Container>
    );
  }

  /** Invalid Token */
  if (!tokenValid) {
    return (
      <div className="invalid-token-container">
        <img src={logo} alt="Logo" className="invalid-token-logo" />
        <Typography className="invalid-token-title">Invalid or Expired Token</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
          className="invalid-token-button"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  /** Valid Token - Show Reset Form */
  return (
    <ResetPasswordForm
      onSubmit={handleResetPassword}
      loading={loading}
      fields={[
        { name: "newPassword", label: "New Password", type: "password", error: formErrors.newPassword },
        { name: "confirmPassword", label: "Confirm New Password", type: "password", error: formErrors.confirmPassword },
      ]}
    />
  );
}
