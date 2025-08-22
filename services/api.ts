import axios from "axios";

const api = axios.create({
  baseURL: "https://zeladoria.tsr.net.br/api", // base da sua API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
