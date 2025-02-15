import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiRequest = async ({ method, url, data, params, requiresAuth = false}) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      params,
      withCredentials: requiresAuth,
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
