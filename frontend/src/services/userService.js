import { apiRequest } from "../services/http-service";

const userService = {
  updateUserName: (data) => apiRequest({ method: "PUT", url: "/user/change-name", data }),
//   updateUserEmail: (data) => apiRequest({ method: "PUT", url: "/user/change-email", data }),
  updateUserPassword: (data) => apiRequest({ method: "PUT", url: "/user/change-password", data }),
};

export default userService;
