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
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [email, setEmail] = useState("");

  const isLoggedIn = !!user;

  useEffect(() => {
    console.log("🍪 Current cookies:", cookies);
  }, [cookies]);

  useEffect(() => {
    console.log("🔄 isLoggedIn changed:", isLoggedIn);
  }, [isLoggedIn]);

//   /** 🔹 Always fetch user on mount */
//   useEffect(() => {
//     fetchCurrentUser();
//   }, []);

//   const fetchCurrentUser = async () => {
//     setLoading(true);
//     const response = await userApi.getCurrentUser({ params: { t: Date.now() } });
//     setLoading(false);

//     if (response.success) {
//       setUser(response.data);
//       console.log("✅ Fetch user success");
//     } else {
//       console.warn("⚠️ User not logged in or token invalid. Logging out...");
//       handleLogout();
//     }
//   };

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
    const response = await publicApi.verifyUser({ email, verificationCode: otp });
    if (response.success) {
      setShowOtpDialog(false);
    }
    return response;
  };

  const resendVerification = async () => {
    return await publicApi.resendVerification(email);
  };

  const handleLogout = () => {
    removeCookie("authToken", { path: "/" });
    setUser(null);
    navigate("/");
  };

  const handleLogin = (response) => {
    console.log("🔹 Login successful. Fetching user...");
    setUser(response.data);
    console.log(user);
    // fetchCurrentUser();
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
    loading,
    showOtpDialog,
    setShowOtpDialog,
    email,
  };
}
