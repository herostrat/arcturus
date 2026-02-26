import { useState, useCallback, type ReactNode } from 'react'
import styles from './InstrumentPanel.module.css'

const MIN_WIDTH = 180
const COLLAPSED_WIDTH = 0

interface InstrumentPanelProps {
  children?: ReactNode
}

export function InstrumentPanel({ children }: InstrumentPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [width, setWidth] = useState(280)
  const [isDragging, setIsDragging] = useState(false)

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsDragging(true)
    },
    [],
  )

  const handleResizePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return
      const maxWidth = Math.floor(window.innerWidth * 0.5)
      const newWidth = window.innerWidth - e.clientX
      setWidth(Math.min(maxWidth, Math.max(MIN_WIDTH, newWidth)))
    },
    [isDragging],
  )

  const handleResizePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const panelWidth = isOpen ? width : COLLAPSED_WIDTH

  return (
    <>
      {/* Toggle button – sits outside the panel, always visible */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close instrument panel' : 'Open instrument panel'}
        title={isOpen ? 'Close panel' : 'Instruments'}
      >
        {isOpen ? '›' : '‹'}
      </button>

      <aside
        className={`${styles.panel} ${isDragging ? styles.panelDragging : ''}`}
        style={{ width: panelWidth }}
        aria-hidden={!isOpen}
      >
        {/* Drag handle on the left edge */}
        <div
          className={styles.resizeHandle}
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          onPointerCancel={handleResizePointerUp}
          role="separator"
          aria-label="Resize instrument panel"
        />

        <div className={styles.content}>{children ?? <PanelPlaceholder />}</div>
      </aside>
    </>
  )
}

function PanelPlaceholder() {
  return (
    <div style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
      Instrument panel – content coming soon
    </div>
  )
}
