import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useAuth from "../hooks/useAuth";

export default function SignupPage() {
  const { registerUser, loading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  const handleSignup = async (userData) => {
    const response = await registerUser(userData);

    if (response.success) {
      enqueueSnackbar(response.message, { variant: "success" });
      navigate("/login");
    } else {
      if (typeof response.message === "object") {
        setFormErrors(response.message);
      } else {
        enqueueSnackbar(response.message || "Signup failed. Please try again.", { variant: "error" });
      }
    }
  };

  return (
    <AuthForm
      title="Sign Up"
      fields={[
        { name: "firstName", label: "First Name", autoFocus: true, error: formErrors.firstName },
        { name: "lastName", label: "Last Name", error: formErrors.lastName },
        { name: "email", label: "Email Address", type: "email", autoComplete: "email", error: formErrors.email },
        { name: "password", label: "Password", type: "password", autoComplete: "new-password", error: formErrors.password },
      ]}
      buttonText="Sign Up"
      onSubmit={handleSignup}
      linkMessage="Already have an account?"
      linkText="Login"
      linkTo="/login"
      enabled={!loading} 
      loading={loading}
    />
  );
}
