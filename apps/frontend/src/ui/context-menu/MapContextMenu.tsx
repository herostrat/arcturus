import { useEffect, useRef } from 'react'
import { useMapInteraction } from '../../store/map-interaction.js'
import { useMap } from '../../context/MapContext.js'
import { inspectBbox, groupFeaturesBySource } from '../../adapters/map/inspect-features.js'
import styles from './MapContextMenu.module.css'

interface MenuItem {
  id: string
  label: string
  icon: string
  action: () => void
}

export function MapContextMenu() {
  const { contextMenu, closeContextMenu, setInspectResult } = useMapInteraction()
  const map = useMap()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contextMenu) return
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu()
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeContextMenu()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [contextMenu, closeContextMenu])

  if (!contextMenu) return null

  const { screenX, screenY, lng, lat } = contextMenu

  const items: MenuItem[] = [
    {
      id: 'set-waypoint',
      label: 'Wegpunkt setzen',
      icon: '📍',
      action: () => {
        // TODO: dispatch CreateWaypoint use-case (Phase 3 CRUD)
        closeContextMenu()
      },
    },
    {
      id: 'set-anchor-warning',
      label: 'Anker-Warnung setzen',
      icon: '⚓',
      action: () => {
        // TODO: dispatch CreateAnchorWarning use-case
        closeContextMenu()
      },
    },
    {
      id: 'inspect',
      label: 'Inspizieren',
      icon: '🔍',
      action: () => {
        const features = map
          ? map.queryRenderedFeatures(inspectBbox(screenX, screenY))
          : []
        const groups = groupFeaturesBySource(features)
        setInspectResult({ lng, lat, groups })
      },
    },
  ]

  const style: React.CSSProperties = { left: screenX, top: screenY }

  return (
    <div className={styles.menu} style={style} ref={menuRef} role="menu">
      <div className={styles.coords}>
        {lat.toFixed(5)}°N &nbsp; {lng.toFixed(5)}°E
      </div>
      {items.map((item, idx) => (
        <>
          {idx === items.length - 1 && <div key={`sep-${item.id}`} className={styles.separator} />}
          <button key={item.id} className={styles.item} role="menuitem" onClick={item.action}>
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </button>
        </>
      ))}
    </div>
  )
}
