import axios from "axios";

let AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default AxiosInstance;
