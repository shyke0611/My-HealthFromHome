import useProtectedAPI from "./useProtectedApi";
import { useAuthContext } from "../context/AuthContext";

export default function useUser() {
  const { user, setUser } = useAuthContext();
  
  const protectedApi = useProtectedAPI();

  const updateUserName = async (data) => {
    const response = await protectedApi.updateUserName(data);
    if (response.success) {
      setUser((prevUser) => ({ ...prevUser, ...data }));
    }
    return response;
  };

  const updateUserEmail = async (data) => {
    const response = await protectedApi.updateUserEmail(data);
    if (response.success) {
      setUser((prevUser) => ({ ...prevUser, email: data.newEmail }));
    }
    return response;
  };

  const updateUserPassword = async (data) => {
    return await protectedApi.updateUserPassword(data);
  };

  return {
    updateUserName,
    updateUserEmail,
    updateUserPassword,
  };
}
