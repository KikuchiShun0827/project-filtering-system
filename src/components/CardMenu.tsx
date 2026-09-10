import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MenuIcon } from './icons'

export interface CardMenuItem {
  label: string
  onSelect: () => void
  /** 削除など、取り消せない操作を赤字にする */
  danger?: boolean
}

/**
 * カード右上・表の行末に置くハンバーガーメニュー。
 * 外側クリックと Esc で閉じ、クリックが下のカードへ伝わらないようにする。
 * リストは表のスクロール枠に切られないよう、ボタンの位置に合わせて画面基準で配置する。
 */
const CardMenu = ({
  items,
  label = 'メニューを開く',
  alert = false,
}: {
  items: CardMenuItem[]
  label?: string
  /** 未確認の知らせがあることを示す赤いマークをボタンに重ねる */
  alert?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    // 画面基準で置いているので、スクロールやリサイズで位置がずれる前に閉じる
    const close = () => setOpen(false)
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  // 画面下にはみ出すときはボタンの上側へ出す
  useLayoutEffect(() => {
    if (!open || !list.current || !button.current) return
    const height = list.current.offsetHeight
    if (pos.top + height <= window.innerHeight - 8) return
    const top = Math.max(8, button.current.getBoundingClientRect().top - height - 6)
    if (top !== pos.top) setPos({ ...pos, top })
  }, [open, pos])

  if (items.length === 0) return null

  const toggle = () => {
    if (open) {
      setOpen(false)
      return
    }
    const rect = button.current!.getBoundingClientRect()
    setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right })
    setOpen(true)
  }

  return (
    <div className="card-menu" ref={root} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        ref={button}
        className="card-menu-button"
        aria-label={alert ? `${label}（未確認の返信あり）` : label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <MenuIcon />
        {alert && <span className="card-menu-dot" aria-hidden="true" />}
      </button>

      {open && (
        <div
          className="card-menu-list"
          role="menu"
          ref={list}
          style={{ position: 'fixed', top: pos.top, right: pos.right }}
        >
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
