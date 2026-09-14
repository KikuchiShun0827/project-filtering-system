import { css, cx } from '@emotion/css'
import type { MouseEventHandler, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

/** ページ上部の見出し。右側には任意のアクションを置ける */
export const PageHeader = ({ title, actions }: { title: ReactNode; actions?: ReactNode }) => (
  <div className={styles.head}>
    <h1 className={styles.title}>{title}</h1>
    {actions}
  </div>
)

/** 詳細ページ用の見出し。先頭に「戻る」ボタンが付く */
export const DetailHeader = ({
  title,
  description,
  actions,
}: {
  /** 見出しが不要なページでは省略できる */
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) => {
  const navigate = useNavigate()
  return (
    <div className={styles.head}>
      <div>
        <button className="btn btn-sm" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        {title && (
          <h1 className={styles.title} style={{ marginTop: 10 }}>
            {title}
          </h1>
        )}
        {description && <p className="page-desc">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

/** 該当データがないときの表示 */
export const EmptyState = ({ children, card = true }: { children: ReactNode; card?: boolean }) => (
  <div className={cx(card && 'card', styles.empty)}>{children}</div>
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
  <section className={cx('card card-pad', className)} onClick={onClick}>
    {label && <div className="section-label">{label}</div>}
    {children}
  </section>
)

const styles = {
  head: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  `,

  title: css`
    margin: 0;
    font-size: 21px;
    font-weight: 700;
  `,

  empty: css`
    padding: 40px;
    text-align: center;
    color: var(--text-muted);
  `,
}
