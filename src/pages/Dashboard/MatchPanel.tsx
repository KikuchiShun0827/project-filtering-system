import { css } from '@emotion/css'
import type { CSSProperties, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { MatchBar, MatchScore } from '../../components/Match'

export interface MatchRow {
  id: string
  name: string
  /** 名前の右に出すバッジ（ステータスなど） */
  tag?: ReactNode
  note: string
  score: number
  /** クリック時の遷移先 */
  to: string
}

/**
 * カード右側のマッチ候補リスト。案件カード・人材カードで共用。
 * 候補は全件受け取り、visibleRows 行分の高さに収めて残りはスクロールで見せる。
 */
const MatchPanel = ({ label, rows, visibleRows }: { label: string; rows: MatchRow[]; visibleRows: number }) => {
  const navigate = useNavigate()
  return (
    <div className={styles.panel}>
      <div className="section-label">{label}</div>
      <div className={styles.list} style={{ '--rows': visibleRows } as CSSProperties}>
        {rows.map((row, i) => (
          <div
            key={row.id}
            className={styles.row}
            onClick={() => navigate(row.to)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(row.to)}
          >
            <span className={styles.rank}>{i + 1}</span>
            <div style={{ minWidth: 0 }}>
              <div className={styles.name}>
                <span className={styles.nameText}>{row.name}</span>
                {row.tag}
              </div>
              <div className={styles.note}>{row.note}</div>
            </div>
            <div className={styles.figure}>
              <MatchScore score={row.score} />
              <MatchBar score={row.score} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchPanel

const styles = {
  panel: css`
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
  `,

  /* 設定件数ぶんの高さに収め、残りはスクロールで見せる */
  list: css`
    max-height: calc(var(--rows, 5) * 52px);
    overflow-y: auto;
    /* スクロールバーと行の内容を離す。gutter を常に確保して出現時のガタつきも防ぐ */
    padding-right: 12px;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    overscroll-behavior: contain;
  `,

  /* 1 行 52px = padding 7 + 名前 20 + 補足 18 + padding 7 に固定 */
  row: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 6px;
    border-radius: 8px;
    height: 52px;

    &:hover {
      background: var(--surface);
    }

    & + & {
      border-top: 1px solid var(--border);
    }
  `,

  rank: css`
    width: 18px;
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 700;
  `,

  name: css`
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;

    /* 行の高さ 52px に収まるよう、この中のバッジだけ小さめにする */
    & .badge {
      flex: none;
      padding: 1px 8px;
      font-size: 11px;
      line-height: 16px;
    }
  `,

  /* 名前だけを省略対象にして、バッジは切れないようにする */
  nameText: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  note: css`
    font-size: 11px;
    color: var(--text-muted);
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  figure: css`
    margin-left: auto;
    text-align: right;
    min-width: 76px;
  `,
}
