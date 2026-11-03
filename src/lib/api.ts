import axios from "axios";

const rawBase =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (typeof process !== "undefined" && process.env?.VITE_BACKEND_URL) ||
  "https://dsc-vitamins-boot-employers.trycloudflare.com";

const BASE_URL = rawBase.replace(/\/+$/, "");

const API_URL = BASE_URL + "/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = "Bearer " + token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function fixImageUrl(url: string, width = 800): string {
  if (!url) return url;
  const w = width > 0 ? width : 800;
  let fixed = url
    .replace("http://localhost:8080", BASE_URL)
    .replace("https://kangaroo-elude-reshape.ngrok-free.dev", BASE_URL);

  // Auto-optimize Cloudinary URLs: inject automatic WebP/AVIF format and auto quality
  if (fixed.includes("res.cloudinary.com") && fixed.includes("/image/upload/")) {
    if (!fixed.includes("f_auto")) {
      fixed = fixed.replace(
        "/image/upload/",
        `/image/upload/f_auto,q_auto,w_${w},c_limit/`
      );
    }
  }

  return fixed;
}

