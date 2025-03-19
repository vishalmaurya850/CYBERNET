// Create a new API utility file to centralize API calls
import axios from "axios"

// Base API URL
const API_BASE_URL = "http://127.0.0.1:8000/api"

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API Error:", error)
    return Promise.reject(error)
  },
)

// API functions
export const api = {
  // Status endpoints
  status: {
    get: async () => {
      const response = await apiClient.get("/status/")
      return response.data
    },
  },

  // Flows endpoints
  flows: {
    getAll: async () => {
      const response = await apiClient.get("/flows/")
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/flows/${id}/`)
      return response.data
    },
    getRecent: async (limit = 10) => {
      const response = await apiClient.get(`/flows/recent/?limit=${limit}`)
      return response.data
    },
  },

  // Alerts endpoints
  alerts: {
    getAll: async () => {
      const response = await apiClient.get("/alerts/")
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/alerts/${id}/`)
      return response.data
    },
    getBySeverity: async (severity: string) => {
      const response = await apiClient.get(`/alerts/severity/${severity}/`)
      return response.data
    },
    getRecent: async (limit = 5) => {
      const response = await apiClient.get(`/alerts/recent/?limit=${limit}`)
      return response.data
    },
  },

  // Config endpoints
  config: {
    get: async () => {
      const response = await apiClient.get("/config/")
      return response.data
    },
    getApiKey: async () => {
      const response = await apiClient.get("/config/api-key/")
      return response.data
    },
  },
}

export default api