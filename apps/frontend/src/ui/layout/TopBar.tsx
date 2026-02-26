import { ObTopBar } from '../components/ob/ObTopBar.js'
import { useConnectivityStore } from '../../store/connectivity.js'
import styles from './TopBar.module.css'

export function TopBar() {
  const backendStatus = useConnectivityStore((s) => s.backendStatus)
  const chartSource = useConnectivityStore((s) => s.chartSource)

  return (
    <ObTopBar>
      <span className={styles.appName}>Arcturus</span>
      <div className={styles.spacer} />
      <StatusIndicator label="Backend" status={backendStatus} />
      <StatusIndicator
        label="Charts"
        status={chartSource === 'online-fallback' ? 'warn' : 'ok'}
        detail={chartSource === 'online-fallback' ? 'Online Fallback' : 'Local'}
      />
    </ObTopBar>
  )
}

interface StatusIndicatorProps {
  label: string
  status: 'unknown' | 'connected' | 'disconnected' | 'ok' | 'warn' | 'error'
  detail?: string
}

function StatusIndicator({ label, status, detail }: StatusIndicatorProps) {
  const dotClass =
    status === 'connected' || status === 'ok'
      ? styles.dotOk
      : status === 'warn' || status === 'unknown'
        ? styles.dotWarn
        : styles.dotError

  return (
    <div className={styles.statusItem}>
      <span className={`${styles.dot} ${dotClass}`} />
      <span className={styles.statusLabel}>
        {label}
        {detail ? `: ${detail}` : ''}
      </span>
    </div>
  )
}
