import api from './api'
import { DashboardSummary } from '@/types/dashboard'

const RESOURCE = '/dashboard/summary'

export const DashboardService = {
  list: async (): Promise<DashboardSummary> => {
    const { data } = await api.get(RESOURCE)
    return data.data
  },
}

export default DashboardService
