import { css } from '@emotion/css'
import type { ReactNode } from 'react'
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
}
