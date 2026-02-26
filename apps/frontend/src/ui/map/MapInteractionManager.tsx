import { useEffect, useRef } from 'react'
import type maplibregl from 'maplibre-gl'
import { useMapInteraction } from '../../store/map-interaction.js'

interface Props {
  map: maplibregl.Map
}

const LONG_PRESS_MS = 500

/**
 * Attaches interaction listeners to the MapLibre map instance.
 * Renders nothing – pure side-effect component.
 *
 * Interactions:
 *  - Left-click on a feature → selectFeature
 *  - Left-click on empty map → clearSelection (if panel open) / no-op
 *  - Right-click → openContextMenu
 *  - Long-press (touch) → openContextMenu
 */
export function MapInteractionManager({ map }: Props) {
  const { selectFeature, clearSelection, openContextMenu } = useMapInteraction()
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchMoved = useRef(false)

  useEffect(() => {
    function onMapClick(e: maplibregl.MapMouseEvent) {
      const point = e.point
      // Query a small pixel radius to hit small features
      const features = map.queryRenderedFeatures(
        [
          [point.x - 4, point.y - 4],
          [point.x + 4, point.y + 4],
        ],
        // Only interactive layers (future: pass layerIds from props)
      )

      if (features.length > 0) {
        const f = features[0]!
        selectFeature({
          id: String(f.id ?? `${f.layer.id}-${e.lngLat.lng}-${e.lngLat.lat}`),
          layerId: f.layer.id,
          screenX: point.x,
          screenY: point.y,
          lng: e.lngLat.lng,
          lat: e.lngLat.lat,
          properties: (f.properties ?? {}) as Record<string, unknown>,
        })
      } else {
        // No vector feature hit (e.g. raster tile background) → show position info
        selectFeature({
          id: `position-${e.lngLat.lng.toFixed(6)}-${e.lngLat.lat.toFixed(6)}`,
          layerId: '',
          screenX: point.x,
          screenY: point.y,
          lng: e.lngLat.lng,
          lat: e.lngLat.lat,
          properties: {},
        })
      }
    }

    function onContextMenu(e: maplibregl.MapMouseEvent) {
      e.preventDefault()
      openContextMenu({
        screenX: e.point.x,
        screenY: e.point.y,
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      })
    }

    // Touch long-press via touchstart/touchend/touchmove
    function onTouchStart(e: maplibregl.MapTouchEvent) {
      touchMoved.current = false
      if (e.points.length !== 1) return
      const point = e.points[0]!
      longPressTimer.current = setTimeout(() => {
        if (!touchMoved.current) {
          openContextMenu({
            screenX: point.x,
            screenY: point.y,
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
          })
        }
      }, LONG_PRESS_MS)
    }

    function onTouchMove() {
      touchMoved.current = true
      if (longPressTimer.current !== null) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }

    function onTouchEnd() {
      if (longPressTimer.current !== null) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }

    map.on('click', onMapClick)
    map.on('contextmenu', onContextMenu)
    map.on('touchstart', onTouchStart)
    map.on('touchmove', onTouchMove)
    map.on('touchend', onTouchEnd)

    return () => {
      map.off('click', onMapClick)
      map.off('contextmenu', onContextMenu)
      map.off('touchstart', onTouchStart)
      map.off('touchmove', onTouchMove)
      map.off('touchend', onTouchEnd)
      if (longPressTimer.current !== null) clearTimeout(longPressTimer.current)
    }
  }, [map, selectFeature, clearSelection, openContextMenu])

  return null
}
