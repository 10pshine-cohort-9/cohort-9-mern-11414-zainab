import axios from "axios"
import { getToken } from "./auth"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
})

api.interceptors.request.use((requestConfig) => {
    const token = getToken()
    if (token) requestConfig.headers.Authorization = `Bearer ${token}`
    return requestConfig
})
