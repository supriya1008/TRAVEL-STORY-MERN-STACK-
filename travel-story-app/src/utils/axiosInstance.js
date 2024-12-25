import axios from "axios";
import { BASE_URL } from "./constants"; // Ensure BASE_URL is correctly imported from constants

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Ensure baseURL is set correctly
  timeout: 10000, // Timeout in milliseconds (10 seconds)
  headers: {
    "Content-Type": "application/json", // Ensure Content-Type is set correctly
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Add token to the Authorization header
    }
    return config; // Return modified config
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

// Optional: Add a response interceptor to handle specific error scenarios (e.g., unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response as it is if no error
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized, handle as needed
      localStorage.clear(); // Clear the token
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error); // Handle other errors
  }
);

export default axiosInstance; // Export the configured axios instance
