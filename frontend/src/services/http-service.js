import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const setupAxiosInterceptors = (setUser) => {
  if (axiosInstance.interceptors.response.handlers.length > 0) {
    console.log("⚠️ Axios interceptors already set. Skipping setup.");
    return;
  }

  console.log("⚡ Setting up Axios interceptors...");

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        originalRequest.url !== "/auth/login" &&
        originalRequest.url !== "/auth/refresh" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const refreshedToken = await refreshAccessToken();

        if (refreshedToken) {
          console.log("Access token refreshed successfully!");
          return axiosInstance.request(originalRequest);
        } else {
          console.warn("Refresh failed. Logging out user...");
          if (setUser) {
            setUser(null);
          }
          window.location.href = "/login"; 
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};


export const apiRequest = async ({ method, url, data, params }) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      params,
    });

    console.log("API response (success):", response.data);

    return {
      success: true,
      status: response.status,
      message: response.data.message || "Request successful",
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error("API response (error):", error.response?.data || error.message);

    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "Request failed",
        data: null,
      };
    }

    return {
      success: false,
      status: null,
      message: "Something went wrong. Please try again.",
      data: null,
    };
  }
};
