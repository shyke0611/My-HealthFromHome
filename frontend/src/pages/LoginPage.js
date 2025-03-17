import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import VerificationDialog from "../components/VerificationDialog";
import ForgotPasswordDialog from "../components/ForgotPasswordDialog";
import useAuth from "../hooks/useAuth";
import { useSnackbar } from "notistack";

export default function LoginPage() {
  const { loginUser, oauthLoginUser, verifyUser, forgotPassword, resendVerification, loading, email } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [forgotPasswordError, setForgotPasswordError] = useState("");

  const handleLogin = async (userData) => {
    const response = await loginUser(userData);

    if (response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
    } else {
      if (typeof response.message === "object") {
        setFormErrors(response.message);
        if (response.message.verify) {
          setShowOtpDialog(true);
        } else if (response.message.credentials) {
          enqueueSnackbar(response.message.credentials, { variant: "error" });
        }
      } else {
        enqueueSnackbar(response.message || "Login failed. Please try again.", { variant: "error" });
      }
    }
  };

  const handleGoogleLogin = async (response) => {
    const idToken = response.credential;
    try {
      const result = await oauthLoginUser(idToken);
      if (result.success) {
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message || "Google login failed. Please try again.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while logging in with Google.", { variant: "error" });
    }
  };

  const handleVerification = async (otpCode) => {
    const response = await verifyUser(otpCode);

    if (response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
      setShowOtpDialog(false);
    } else {
      if (response.message.verificationExpired) {
        enqueueSnackbar(response.message.verificationExpired, { variant: "error" });
      } else if (response.message.verificationInvalid) {
        enqueueSnackbar(response.message.verificationInvalid, { variant: "error" });
      } else {
        enqueueSnackbar(response.message || "Verification failed. Please try again.", { variant: "error" });
      }
    }
  };

  const handleResend = async (userData) => {
    const response = await resendVerification(userData);

    if (response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
    }
  };

  const handleForgotPasswordSubmit = async (email) => {
    setForgotPasswordError("");
    const response = await forgotPassword(email);
    if (response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
      setForgotPasswordOpen(false);
    } else {
      setForgotPasswordError(response.message || "Failed to send reset link.");
    }
  };

  return (
    <>
      <AuthForm
        title="Login"
        fields={[
          { name: "email", label: "Email Address", type: "email", autoComplete: "email", autoFocus: true, error: formErrors.email },
          { name: "password", label: "Password", type: "password", autoComplete: "current-password", error: formErrors.password },
        ]}
        buttonText="Login"
        onSubmit={handleLogin}
        linkMessage="Don't have an account?"
        linkText="Sign Up"
        linkTo="/signup"
        extraLinkText="Forgot Password?"
        extraLinkOnClick={() => setForgotPasswordOpen(true)}
        enabled={!loading}
        loading={loading}
        onGoogleLogin={handleGoogleLogin}
      />

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onSubmit={handleForgotPasswordSubmit}
        loading={loading}
        errorMessage={forgotPasswordError}
      />

      <VerificationDialog
        open={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        onVerify={handleVerification}
        onResend={handleResend}
        email={email}
      />
    </>
  );
}
