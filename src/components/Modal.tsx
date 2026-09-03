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
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <h2 className="modal-title" id="modal-title">
            {title}
          </h2>
          <button type="button" className="modal-close" aria-label="閉じる" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
