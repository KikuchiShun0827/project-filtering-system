import { css } from '@emotion/css'
import { useEffect, type ReactNode } from 'react'

/**
 * 中央表示のモーダル。
 * 誤って閉じないようオーバーレイのクリックでは閉じず、Esc と閉じるボタンのみで閉じる。
 * 開いている間は背後のスクロールを止める。
 */
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) => {
  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.head}>
          <h2 className={styles.title} id="modal-title">
            {title}
          </h2>
          <button type="button" className={styles.close} aria-label="閉じる" onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

export default Modal

const styles = {
  overlay: css`
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(15, 23, 42, 0.45);
  `,

  modal: css`
    width: 100%;
    max-width: 520px;
    max-height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  `,

  head: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    border-bottom: 1px solid var(--border);
  `,

  title: css`
    margin: 0;
    font-size: 15px;
    font-weight: 700;
  `,

  close: css`
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: 20px;
    line-height: 1;
    padding: 2px 6px;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background: var(--surface-2);
      color: var(--text);
    }
  `,

  body: css`
    padding: 18px;
    overflow-y: auto;
  `,
}
