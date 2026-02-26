import { create } from 'zustand'

export type BackendStatus = 'unknown' | 'connected' | 'disconnected'
export type ChartSource = 'online-fallback' | 'backend-chartserver' | 'client-cache'

interface ConnectivityState {
  backendUrl: string | null
  backendStatus: BackendStatus
  chartSource: ChartSource
  actions: {
    setBackendUrl: (url: string | null) => void
    setBackendStatus: (status: BackendStatus) => void
    setChartSource: (source: ChartSource) => void
  }
}

export const useConnectivityStore = create<ConnectivityState>()((set) => ({
  backendUrl: null,
  backendStatus: 'unknown',
  chartSource: 'online-fallback',
  actions: {
    setBackendUrl: (url) => set({ backendUrl: url }),
    setBackendStatus: (backendStatus) => set({ backendStatus }),
    setChartSource: (chartSource) => set({ chartSource }),
  },
}))
