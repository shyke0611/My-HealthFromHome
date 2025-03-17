import userService from "../services/userService";

export default function useProtectedAPI() {
  return {
    updateUserName: userService.updateUserName,
    // updateUserEmail: userService.updateUserEmail,
    updateUserPassword: userService.updateUserPassword,
  };
}
