import { create } from 'zustand'

export interface SelectedFeature {
  id: string
  layerId: string
  screenX: number
  screenY: number
  lng: number
  lat: number
  properties: Record<string, unknown>
}

export interface InspectedFeatureItem {
  layerId: string
  label: string
  properties: Record<string, unknown>
}

export interface InspectedSourceGroup {
  sourceId: string
  items: InspectedFeatureItem[]
}

export interface InspectResult {
  lng: number
  lat: number
  groups: InspectedSourceGroup[]
}

export interface ContextMenuState {
  screenX: number
  screenY: number
  lng: number
  lat: number
}

interface MapInteractionState {
  selectedFeature: SelectedFeature | null
  inspectResult: InspectResult | null
  contextMenu: ContextMenuState | null

  selectFeature: (feature: SelectedFeature) => void
  clearSelection: () => void

  setInspectResult: (result: InspectResult) => void
  clearInspect: () => void

  openContextMenu: (pos: ContextMenuState) => void
  closeContextMenu: () => void
}

export const useMapInteraction = create<MapInteractionState>((set) => ({
  selectedFeature: null,
  inspectResult: null,
  contextMenu: null,

  selectFeature: (feature) =>
    set({ selectedFeature: feature, inspectResult: null, contextMenu: null }),

  clearSelection: () => set({ selectedFeature: null, inspectResult: null }),

  setInspectResult: (result) =>
    set({ inspectResult: result, selectedFeature: null, contextMenu: null }),

  clearInspect: () => set({ inspectResult: null }),

  openContextMenu: (pos) =>
    set({ contextMenu: pos, selectedFeature: null, inspectResult: null }),

  closeContextMenu: () => set({ contextMenu: null }),
}))
