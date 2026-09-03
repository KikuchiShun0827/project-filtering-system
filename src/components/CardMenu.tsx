import { useEffect, useRef, useState } from 'react'
import { MenuIcon } from './icons'

export interface CardMenuItem {
  label: string
  onSelect: () => void
  /** 削除など、取り消せない操作を赤字にする */
  danger?: boolean
}

/**
 * カード右上のハンバーガーメニュー。
 * 外側クリックと Esc で閉じ、クリックが下のカードへ伝わらないようにする。
 */
const CardMenu = ({ items, label = 'メニューを開く' }: { items: CardMenuItem[]; label?: string }) => {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  if (items.length === 0) return null

  return (
    <div className="card-menu" ref={root} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="card-menu-button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <MenuIcon />
      </button>

      {open && (
        <div className="card-menu-list" role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={item.danger ? 'danger' : undefined}
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CardMenu
