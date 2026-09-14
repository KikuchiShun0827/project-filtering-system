import { css } from '@emotion/css'
import type { ReactNode } from 'react'

/** 「見出し＋説明」と操作 UI を左右に並べる設定項目 */
const SettingRow = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
  <div className={styles.row}>
    <div>
      <div className={styles.title}>{title}</div>
      <div className="muted small">{description}</div>
    </div>
    {children}
  </div>
)

export default SettingRow

const styles = {
  row: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);

    &:last-child {
      border-bottom: none;
    }
  `,

  title: css`
    font-weight: 700;
  `,
}
