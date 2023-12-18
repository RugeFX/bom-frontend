import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL ?? "http://localhost:8000/api",
});

apiClient.defaults.headers.common["Content-Type"] = "application/json";
apiClient.defaults.headers.common["Accept"] = "application/json";

export default apiClient;
