import type { InspectResult } from '../../store/map-interaction.js'
import styles from './InspectGroupContent.module.css'

interface Props {
  result: InspectResult
}

export function InspectGroupContent({ result }: Props) {
  const { lng, lat, groups } = result

  return (
    <div className={styles.root}>
      <div className={styles.coords}>
        {lat.toFixed(5)}°N &nbsp; {lng.toFixed(5)}°E
      </div>

      {groups.length === 0 && (
        <p className={styles.empty}>Keine Objekte gefunden.</p>
      )}

      {groups.map((group) => (
        <div key={group.sourceId} className={styles.group}>
          <div className={styles.sourceLabel}>{group.sourceId}</div>
          <ul className={styles.itemList}>
            {group.items.map((item, i) => (
              <li key={`${item.layerId}-${i}`} className={styles.item}>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
