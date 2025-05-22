import axios, { AxiosError, AxiosInstance } from "axios";
import { API_URL } from "./constants";

/**
 * ApiError class to standardize error handling across services
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromAxiosError(error: AxiosError): ApiError {
    const message =
      error.response?.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
        ? (error.response.data as { message: string }).message
        : error.message || "API request failed";
    const statusCode = error.response?.status;
    const response = error.response?.data;

    return new ApiError(message, statusCode, response);
  }
}

/**
 * Creates a configured axios instance for API requests
 */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Add request interceptor if needed
  client.interceptors.request.use(
    (config) => {
      // You can add logic like attaching tokens here
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for centralized error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        return Promise.reject(ApiError.fromAxiosError(error));
      }
      return Promise.reject(new ApiError(error.message || "Unknown error"));
    }
  );

  return client;
}

// Export a default API client instance
export const apiClient = createApiClient();
