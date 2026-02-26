import { createContext, useContext, useState, type ReactNode } from 'react'
import type maplibregl from 'maplibre-gl'

interface MapContextValue {
  map: maplibregl.Map | null
  setMap: (map: maplibregl.Map | null) => void
}

const MapContext = createContext<MapContextValue | null>(null)

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<maplibregl.Map | null>(null)
  return <MapContext.Provider value={{ map, setMap }}>{children}</MapContext.Provider>
}

export function useMap(): maplibregl.Map | null {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMap must be used within MapProvider')
  return ctx.map
}

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMapContext must be used within MapProvider')
  return ctx
}
