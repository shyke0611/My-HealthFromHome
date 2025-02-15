import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import VerificationDialog from "../components/VerificationDialog";
import useAuth from "../hooks/useAuth";
import { useSnackbar } from "notistack";


export default function LoginPage() {
  const { loginUser, verifyUser, resendVerification, loading, showOtpDialog, setShowOtpDialog, email } = useAuth();
  const [formErrors, setFormErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();


  const handleLogin = async (userData) => {
    const response = await loginUser(userData);

    if (response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
    } else {
      if (typeof response.message === "object") {
        setFormErrors(response.message);
           if (response.message.verify) {
              setShowOtpDialog(true)    
           } else if (response.message.credentials) {
            enqueueSnackbar(response.message.credentials, { variant: "error" });
           }
      } else {
        enqueueSnackbar(response.message || "Login failed. Please try again.", { variant: "error" });
      }
    }
  };

  const handleVerification = async (userData) => {
    const response = await verifyUser(userData);

    if (response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
    } else {
        if (response.message.verificationExpired) {
          enqueueSnackbar(response.message.verificationExpired, { variant: "error" }); 
        } else if(response.message.verificationInvalid)  {
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
        enabled={!loading} 
        loading={loading}
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
