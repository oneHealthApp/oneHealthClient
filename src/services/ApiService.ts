// import BaseService from './BaseService'
// import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// const ApiService = {
//     fetchData<Response = unknown, Request = Record<string, unknown>>(
//         param: AxiosRequestConfig<Request>,
//     ) {
//         return new Promise<AxiosResponse<Response>>((resolve, reject) => {
//             BaseService(param)
//                 .then((response: AxiosResponse<Response>) => {
//                     resolve(response)
//                 })
//                 .catch((errors: AxiosError) => {
//                     reject(errors)
//                 })
//         })
//     },
// }

// export default ApiService

import { ApiResponse } from "@/@types/common";
import BaseService from "./BaseService";
import type { AxiosRequestConfig, AxiosError } from "axios";

const ApiService = {
  async fetchData<Response = unknown, ErrorData = any>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<Response, ErrorData>> {
    try {
      const response = await BaseService(config);
      return response.data as ApiResponse<Response, ErrorData>;
    } catch (error: any) {
      const axiosError: AxiosError = error;
      const errorResponse = axiosError.response?.data as any;

      // Check if it's a token-related error (401 without specific backend error)
      if (axiosError.response?.status === 401 && !errorResponse?.error) {
        return {
          success: false,
          error: { message: "Authentication required" },
          message: "Your session has expired. Please login again.",
          statusCode: 401,
          timestamp: new Date().toISOString(),
          method: config.method?.toUpperCase() || "GET",
          path: config.url || "",
          requestId: null,
        } as ApiResponse<Response, ErrorData>;
      }

      // For 401 with specific backend errors (like invalid OTP), preserve the backend error
      return {
        success: false,
        error: errorResponse?.error || { message: axiosError.message },
        message:
          errorResponse?.message || axiosError.message || "Network error",
        statusCode: axiosError.response?.status || 500,
        timestamp: new Date().toISOString(),
        method: config.method?.toUpperCase() || "GET",
        path: config.url || "",
        requestId: errorResponse?.requestId || null,
      } as ApiResponse<Response, ErrorData>;
    }
  },
};

export default ApiService;
