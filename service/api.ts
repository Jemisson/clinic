// service/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers ?? {}
    if (!config.headers['Accept']) config.headers['Accept'] = 'application/json'
    if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json'
    if (!config.headers['X-Requested-With']) config.headers['X-Requested-With'] = 'XMLHttpRequest'

    try {
      if (typeof window !== 'undefined') {
        const token = Cookies.get('clinic_token')
        if (token && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
      }
    } catch {/* noop */}
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status

    if (status === 401) {
      Cookies.remove('clinic_token', { path: '/' })
      if (typeof window !== 'undefined') {
        toast.error('Sessão expirada, faça login novamente')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    if (!error.response) {
      if (typeof window !== 'undefined') toast.error('Falha de rede. Verifique sua conexão.')
      return Promise.reject(error)
    }

    const message =
      error.response.data?.status?.message ||
      error.response.data?.message ||
      error.response.data?.error ||
      error.message ||
      'Erro inesperado.'
    if (typeof window !== 'undefined') toast.error(message)

    return Promise.reject(error)
  }
)

export default api
