import { apiRequest } from "../services/http-service";

const authService = {
  registerUser: (userData) => apiRequest({ method: "POST", url: "/auth/signup", data: userData }),

  loginUser: (loginData) => apiRequest({ method: "POST", url: "/auth/login", data: loginData }),

  logoutUser: () => apiRequest({ method: "POST", url: "/auth/logout" }),

  verifyUser: (verifyData) => apiRequest({ method: "POST", url: "/auth/verify", data: verifyData }),

  resendVerification: (email) => apiRequest({ method: "POST", url: `/auth/resendVerification?email=${encodeURIComponent(email)}` }),

  getCurrentUser: () => apiRequest({ method: "GET", url: "/user/me", requiresAuth: true }),
};

export default authService;
