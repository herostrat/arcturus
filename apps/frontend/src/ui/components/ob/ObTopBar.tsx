/**
 * OBD6 TopBar wrapper – placeholder until OpenBridge Web Components v6 is published.
 * Replace the internals here when OBD6 is available; the props API stays stable.
 * See: ADR-003-openbridge-wrapper-strategy.md
 */
import type { ReactNode } from 'react'
import styles from './ObTopBar.module.css'

export interface ObTopBarProps {
  children?: ReactNode
}

export function ObTopBar({ children }: ObTopBarProps) {
  return (
    <header className={styles.topbar} role="banner">
      {children}
    </header>
  )
}
