import { css, cx } from '@emotion/css'
import type { ReactNode } from 'react'

/** 該当データがないときの表示 */
const EmptyState = ({ children, card = true }: { children: ReactNode; card?: boolean }) => (
  <div className={cx(card && 'card', styles.empty)}>{children}</div>
)

export default EmptyState

const styles = {
  empty: css`
    padding: 40px;
    text-align: center;
    color: var(--text-muted);
  `,
}
