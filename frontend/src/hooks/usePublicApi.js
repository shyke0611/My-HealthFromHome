import authService from "../services/authService";

export default function usePublicAPI() {
  return {
    registerUser: authService.registerUser,
    loginUser: authService.loginUser,
    oauthLogin: authService.oauthLogin,
    verifyUser: authService.verifyUser,
    resendVerification: authService.resendVerification,
    logoutUser: authService.logoutUser,
    forgotPassword: authService.forgotPassword,
    verifyResetToken: authService.verifyResetToken,
    resetPassword: authService.resetPassword, 
    getCurrentUser: authService.getCurrentUser,
    refreshToken: authService.refreshToken,
  };
}
