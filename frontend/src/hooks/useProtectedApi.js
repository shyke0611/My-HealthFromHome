import authService from "../services/authService";

export default function useProtectedAPI() {
  return {
    getCurrentUser: authService.getCurrentUser,
  };
}
