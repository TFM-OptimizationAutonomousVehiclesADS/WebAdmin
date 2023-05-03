import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readToken } from '@app/services/localStorage.service';

export const httpApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const httpBackApi = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL: "http://192.168.1.133:8080",
  baseURL: "http://34.175.158.61",
});

httpApi.interceptors.request.use((config) => {
  config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` };

  return config;
});

// httpBackApi.interceptors.response.use(undefined, (error: AxiosError) => {
//   throw new ApiError<ApiErrorData>(error.response?.data.message || error.message, error.response?.data);
// });

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  throw new ApiError<ApiErrorData>(error.response?.data.message || error.message, error.response?.data);
});

export interface ApiErrorData {
  message: string;
}
