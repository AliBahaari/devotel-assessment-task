import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://assignment.devotel.io",
  timeout: 50000,
});
