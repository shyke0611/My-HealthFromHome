import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import usePublicAPI from "./usePublicApi";
import useProtectedAPI from "./useProtectedApi";

export default function useAuth() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);
  const [user, setUser] = useState(null);
  const publicApi = usePublicAPI();
  const userApi = useProtectedAPI();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const isLoggedIn = !!user;

  useEffect(() => {
    console.log("🍪 Current cookies:", cookies);
  }, [cookies]);

  useEffect(() => {
    console.log("🔄 isLoggedIn changed:", isLoggedIn);
  }, [isLoggedIn]);

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
      handleLogin(response);
    }
    return response;
  };

  const logoutUser = async () => {
    const response = await publicApi.logoutUser();
    if (response.success) {
      handleLogout();
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

  const handleLogout = () => {
    removeCookie("authToken", { path: "/" });
    setUser(null);
    navigate("/");
  };

  const handleLogin = (response) => {
    console.log("🔹 Login successful. Fetching user...");
    setUser(response.data);
    navigate("/chat");
  };

  return {
    isLoggedIn,
    user,
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
  };
}
