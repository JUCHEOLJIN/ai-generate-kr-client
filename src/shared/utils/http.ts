import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import qs from 'qs'

const FLASK_API_URL = ' http://127.0.0.1:5000'

const axiosInstance = axios.create({
  baseURL: FLASK_API_URL,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  },
})

export const http = {
  get: async <T>(url: string, options?: Pick<AxiosRequestConfig, 'params'>) => {
    const response = await axiosInstance.get<T>(url, {
      params: options?.params,
    })
    return response.data
  },

  post: async <T>(
    url: string,
    data?: AxiosRequestConfig['data'],
    options?: Pick<AxiosRequestConfig, 'params'>,
  ) => {
    const response = await axiosInstance.post<T>(url, data, {
      params: options?.params,
    })
    return response.data
  },

  put: async <T>(url: string, data: unknown) => {
    const response = await axiosInstance.put<T>(url, data)
    return response.data
  },

  delete: async <T>(url: string, options?: Pick<AxiosRequestConfig, 'data' | 'params'>) => {
    const response = await axiosInstance.delete<T>(url, {
      data: options?.data,
      params: options?.params,
    })
    return response.data
  },

  patch: async <T>(
    url: string,
    data: unknown,
    options?: Pick<AxiosRequestConfig, 'headers' | 'params'>,
  ) => {
    const response = await axiosInstance.patch<T>(url, data, {
      headers: options?.headers,
      params: options?.params,
    })
    return response.data
  },
}
