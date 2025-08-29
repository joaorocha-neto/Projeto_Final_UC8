import axios from "axios";
import { getToken, removeToken } from "./authStorage";

const api = axios.create({
  baseURL: "https://zeladoria.tsr.net.br/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      console.log("Token inválido ou expirado, removendo token...");
    }
    return Promise.reject(error);
  }
);

export default api;
