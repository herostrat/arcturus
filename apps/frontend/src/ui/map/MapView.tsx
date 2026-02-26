import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { ONLINE_STYLE_URL, addOpenSeaMapOverlay } from '../../adapters/map/map-style.js'
import { useMapContext } from '../../context/MapContext.js'
import styles from './MapView.module.css'

const DEFAULT_CENTER: [number, number] = [10, 54] // Southern Baltic / North Sea
const DEFAULT_ZOOM = 6
const TOPBAR_PADDING = 48 // keep in sync with --topbar-height

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const { setMap } = useMapContext()

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: ONLINE_STYLE_URL,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    })
    mapRef.current = map

    // Account for the TopBar overlay so fits/flyToBounds center correctly
    map.setPadding({ top: TOPBAR_PADDING, bottom: 0, left: 0, right: 0 })

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right')
    map.addControl(new maplibregl.ScaleControl({ unit: 'nautical' }), 'bottom-left')

    // OpenSeaMap overlay + expose map to context only after style is loaded
    map.once('load', () => {
      addOpenSeaMapOverlay(map)
      setMap(map)
    })

    return () => {
      map.remove()
      mapRef.current = null
      setMap(null)
    }
  }, [setMap])

  return <div ref={containerRef} className={styles.map} />
}
