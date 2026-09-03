import type { MouseEventHandler, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

/** ページ上部の見出し。右側には任意のアクションを置ける */
export const PageHeader = ({ title, actions }: { title: ReactNode; actions?: ReactNode }) => (
  <div className="page-head">
    <h1 className="page-title">{title}</h1>
    {actions}
  </div>
)

/** 詳細ページ用の見出し。先頭に「戻る」ボタンが付く */
export const DetailHeader = ({
  title,
  description,
  actions,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) => {
  const navigate = useNavigate()
  return (
    <div className="page-head">
      <div>
        <button className="btn btn-sm" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1 className="page-title" style={{ marginTop: 10 }}>
          {title}
        </h1>
        {description && <p className="page-desc">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

/** 該当データがないときの表示 */
export const EmptyState = ({ children, card = true }: { children: ReactNode; card?: boolean }) => (
  <div className={card ? 'card empty' : 'empty'}>{children}</div>
)

/** 見出し付きのカードセクション */
export const Section = ({
  label,
  children,
  className,
  onClick,
}: {
  label?: ReactNode
  children: ReactNode
  className?: string
  /** 指定するとカード全体がクリック可能になる */
  onClick?: MouseEventHandler<HTMLElement>
}) => (
  <section className={`card card-pad${className ? ` ${className}` : ''}`} onClick={onClick}>
    {label && <div className="section-label">{label}</div>}
    {children}
  </section>
)
