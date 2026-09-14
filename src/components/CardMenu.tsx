import { css, cx } from '@emotion/css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MenuIcon } from './icons'

export interface CardMenuItem {
  label: string
  onSelect: () => void
  /** 削除など、取り消せない操作を赤字にする */
  danger?: boolean
}

/**
 * カード右上・表の行末に置くハンバーガーメニュー。buttonLabel を渡すと文言入りのボタンで開く。
 * 外側クリックと Esc で閉じ、クリックが下のカードへ伝わらないようにする。
 * リストは表のスクロール枠に切られないよう、ボタンの位置に合わせて画面基準で配置する。
 */
const CardMenu = ({
  items,
  label = 'メニューを開く',
  alert = false,
  buttonLabel,
}: {
  items: CardMenuItem[]
  label?: string
  /** 指定するとハンバーガーアイコンではなく、この文言の強調ボタンでメニューを開く */
  buttonLabel?: string
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
    <div className={styles.root} ref={root} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        ref={button}
        className={buttonLabel ? cx('btn btn-sm btn-primary', styles.labelButton) : styles.button}
        // 文言入りのボタンは表示中の文言をそのまま読み上げに使う
        aria-label={alert ? `${buttonLabel ?? label}（未確認の返信あり）` : buttonLabel ? undefined : label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        {buttonLabel ?? <MenuIcon />}
        {alert && <span className={styles.dot} aria-hidden="true" />}
      </button>

      {open && (
        <div
          className={styles.list}
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

const styles = {
  root: css`
    position: relative;
    flex: none;
  `,

  button: css`
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid var(--border-strong);
    background: var(--surface);
    color: var(--text-muted);
    border-radius: 8px;
    padding: 4px 6px;
    cursor: pointer;

    &:hover {
      background: var(--surface-2);
      color: var(--text);
    }
  `,

  /* 通知マークをボタンの右上に重ねるための基準にする */
  labelButton: css`
    position: relative;
    white-space: nowrap;
  `,

  /* 返信が届いた応募の通知マーク。メニューボタンの右上に重ねる */
  dot: css`
    position: absolute;
    top: -4px;
    right: -4px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--danger);
    border: 1.5px solid var(--surface);
  `,

  list: css`
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 20;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    padding: 6px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    box-shadow: var(--shadow);

    & button {
      border: none;
      background: none;
      font: inherit;
      color: inherit;
      text-align: left;
      white-space: nowrap;
      padding: 8px 10px;
      border-radius: 7px;
      cursor: pointer;
    }

    & button:hover {
      background: var(--surface-2);
    }

    & button.danger {
      color: var(--danger);
    }
  `,
}
