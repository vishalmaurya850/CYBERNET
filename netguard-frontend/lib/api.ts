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

export interface NetworkFlow {
  _id: string
  app_name: string
  total_source_bytes: number
  total_destination_bytes: number
  total_destination_packets: number
  total_source_packets: number
  direction: string
  source: string
  protocol_name: string
  source_port: number
  destination: string
  destination_port: number
  start_datetime: string
  stop_datetime: string
  duration: number
  prediction: string
}

export interface Alert {
  _id?: string
  user: number
  flow: string | NetworkFlow;
  attack_type?: string
  timestamp: string
  severity?: "low" | "medium" | "high" | "critical"
}

export interface Status {
  network_status: string
  recent_flows_count: number
  recent_alerts_count: number
  last_updated: string
}

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
    getAll: async (): Promise<NetworkFlow[]> => {
      const response = await apiClient.get("/flows/")
      return response.data
    },
    getById: async (id: string): Promise<NetworkFlow> => {
      const response = await apiClient.get(`/flows/${id}/`)
      return response.data
    },
    create: async (flowData: Partial<NetworkFlow>): Promise<NetworkFlow> => {
      const response = await apiClient.post("/flows/", flowData)
      return response.data
    },
  },

  // Alerts endpoints
  alerts: {
    getAll: async (): Promise<Alert[]> => {
      const response = await apiClient.get("/alerts/")
      return response.data
    },
    getById: async (id: string): Promise<Alert> => {
      const response = await apiClient.get(`/alerts/${id}/`)
      return response.data
    },
  },

  // Config endpoints
  auth: {
    login: async (username: string, password: string) => {
      const response = await apiClient.post("/auth/login/", { username, password })
      return response.data
    },
    register: async (username: string, email: string, password: string) => {
      const response = await apiClient.post("/auth/register/", { username, email, password })
      return response.data
    },
    getApiKey: async () => {
      const response = await apiClient.get("/auth/api-key/")
      return response.data
    },
  },
}


export default api