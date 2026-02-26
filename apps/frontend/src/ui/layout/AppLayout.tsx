import type { ReactNode } from 'react'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  topBar: ReactNode
  map: ReactNode
  instrumentPanel: ReactNode
  overlays?: ReactNode
}

/**
 * Root layout: TopBar overlaid on map, InstrumentPanel as true sidebar.
 *
 * ┌──────────────────────────────────────┐
 * │  TopBar (absolute overlay, z: 100)   │
 * ├──────────────────┬───────────────────┤
 * │                  │                   │
 * │   Map (flex: 1)  │ InstrumentPanel   │
 * │   + overlays     │ (true sidebar)    │
 * │                  │                   │
 * └──────────────────┴───────────────────┘
 */
export function AppLayout({ topBar, map, instrumentPanel, overlays }: AppLayoutProps) {
  return (
    <div className={styles.root}>
      {/* TopBar overlaid on the map area */}
      <div className={styles.topBarOverlay}>{topBar}</div>

      <div className={styles.body}>
        {/* Map area: fills remaining width, map is absolute inside */}
        <div className={styles.mapArea}>
          {map}
          {overlays && <div className={styles.overlayLayer}>{overlays}</div>}
        </div>

        {/* Instrument panel: true sidebar, not over the map */}
        <div className={styles.panelArea}>{instrumentPanel}</div>
      </div>
    </div>
  )
}
