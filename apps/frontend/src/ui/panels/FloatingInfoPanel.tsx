import type { ReactNode } from 'react'
import styles from './FloatingInfoPanel.module.css'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
}

export function FloatingInfoPanel({ title, onClose, children }: Props) {
  return (
    <div className={styles.panel} role="dialog" aria-label={title}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Schließen">
          ✕
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
