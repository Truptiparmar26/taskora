import axios from "axios";

// Automatically resolve base API endpoint and guarantee it terminates with /api
const resolveBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  // Trim trailing slashes
  url = url.replace(/\/+$/, "");
  // Ensure the endpoint concludes with /api
  if (!url.endsWith("/api")) {
    url += "/api";
  }
  return url;
};

const resolvedBaseURL = resolveBaseUrl();
console.log("⚡ Taskora API Engine Connected To:", resolvedBaseURL);

// Combined production environment & local development server configuration
const API = axios.create({
  baseURL: resolvedBaseURL,
});

// Automatically attach JWT token to every outgoing request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;