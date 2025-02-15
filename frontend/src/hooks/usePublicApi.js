import authService from "../services/authService";

export default function usePublicAPI() {
  return {
    registerUser: authService.registerUser,
    loginUser: authService.loginUser,
    verifyUser: authService.verifyUser,
    resendVerification: authService.resendVerification,
    logoutUser: authService.logoutUser,
  };
}
