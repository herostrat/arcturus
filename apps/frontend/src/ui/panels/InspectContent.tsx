import type { SelectedFeature } from '../../store/map-interaction.js'
import styles from './InspectContent.module.css'

interface Props {
  feature: SelectedFeature
}

function formatCoord(val: number, digits = 5): string {
  return val.toFixed(digits)
}

export function InspectContent({ feature }: Props) {
  const propEntries = Object.entries(feature.properties)

  return (
    <div className={styles.root}>
      <div className={styles.coordRow}>
        <span className={styles.label}>Lat</span>
        <span className={styles.value}>{formatCoord(feature.lat)}°</span>
        <span className={styles.label}>Lng</span>
        <span className={styles.value}>{formatCoord(feature.lng)}°</span>
      </div>
      {feature.layerId && (
        <div className={styles.layerRow}>
          <span className={styles.label}>Layer</span>
          <span className={styles.value}>{feature.layerId}</span>
        </div>
      )}
      {propEntries.length > 0 && (
        <table className={styles.propTable}>
          <tbody>
            {propEntries.map(([k, v]) => (
              <tr key={k}>
                <td className={styles.propKey}>{k}</td>
                <td className={styles.propVal}>{String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
