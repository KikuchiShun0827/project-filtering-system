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
    <div className="match-panel">
      <div className="section-label">{label}</div>
      <div className="match-list" style={{ '--rows': visibleRows } as CSSProperties}>
        {rows.map((row, i) => (
          <div
            key={row.id}
            className="match-row"
            onClick={() => navigate(row.to)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(row.to)}
          >
            <span className="match-rank">{i + 1}</span>
            <div style={{ minWidth: 0 }}>
              <div className="match-name">
                <span className="match-name-text">{row.name}</span>
                {row.tag}
              </div>
              <div className="match-note">{row.note}</div>
            </div>
            <div className="match-figure">
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
