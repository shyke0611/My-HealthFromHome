import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePublicAPI from "./usePublicApi";
import { useAuthContext } from "../context/AuthContext";

export default function useAuth() {
  const navigate = useNavigate();
  const publicApi = usePublicAPI();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { user, setUser } = useAuthContext();

  const isLoggedIn = !!user;

  const registerUser = async (userData) => {
    setLoading(true);
    const response = await publicApi.registerUser(userData);
    setLoading(false);
    return response;
  };

  const loginUser = async (loginData) => {
    setLoading(true);
    setEmail(loginData.email);
    const response = await publicApi.loginUser(loginData);
    setLoading(false);

    if (response.success) {
      setUser(response.data.user);
      navigate("/chat");
    }
    return response;
  };

  const logoutUser = async () => {
    const response = await publicApi.logoutUser();
    if (response.success) {
      setUser(null); 
      navigate("/");
    }
    return response;
  };

  const verifyUser = async (otp) => {
    return await publicApi.verifyUser({ email, verificationCode: otp });
  };

  const resendVerification = async () => {
    return await publicApi.resendVerification(email);
  };

  const forgotPassword = async (email) => {
    return await publicApi.forgotPassword(email);
  };

  const verifyResetToken = async (token) => {
    return await publicApi.verifyResetToken(token);
  };

  const resetPassword = async ({ token, newPassword }) => {
    return await publicApi.resetPassword({ token, newPassword });
  };

  return {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    resendVerification,
    forgotPassword,
    verifyResetToken,
    resetPassword, 
    loading,
    email,
    user,
    isLoggedIn,
  };
}
