// // lib/api.js
// import axios from 'axios';
// import { getToken } from './auth';

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3090/api',
// });

// api.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

// lib/api.js
import axios from 'axios'
import { getToken, removeToken } from './auth'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3090/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const PUBLIC_PATHS = ['/auth/login', '/auth/register']

api.interceptors.request.use(
  config => {
    const isPublic = PUBLIC_PATHS.some(path => config.url?.includes(path))

    // If the request is public (e.g. login), don't check token
    if (isPublic) {
      return config
    }

    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      removeToken()
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login'
      }
      throw new axios.Cancel('Token expired or invalid')
    }

    return config
  },
  error => Promise.reject(error)
)

// Global 401 error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      removeToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
