import { apiRequest } from "../services/http-service";

const authService = {
  registerUser: (userData) => apiRequest({ method: "POST", url: "/auth/signup", data: userData }),

  loginUser: (loginData) => apiRequest({ method: "POST", url: "/auth/login", data: loginData }),

  logoutUser: () => apiRequest({ method: "POST", url: "/auth/logout" }),

  verifyUser: (verifyData) => apiRequest({ method: "POST", url: "/auth/verify", data: verifyData }),

  resendVerification: (email) => apiRequest({ method: "POST", url: `/auth/resendVerification?email=${encodeURIComponent(email)}` }),

  getCurrentUser: () => apiRequest({ method: "GET", url: "/auth/me", requiresAuth: true }),

  forgotPassword: (email) => apiRequest({ method: "POST", url: `/auth/forgot-password?email=${encodeURIComponent(email)}` }),

  verifyResetToken: (resetToken) => apiRequest({ method: "GET", url: `/auth/verify-reset-token?resetToken=${encodeURIComponent(resetToken)}` }),

  resetPassword: (resetPasswordDto) => apiRequest({ method: "POST", url: "/auth/reset-password", data: resetPasswordDto }),

  refreshToken: () => apiRequest({ method: "POST", url: "/auth/refresh" }),

};

export default authService;
