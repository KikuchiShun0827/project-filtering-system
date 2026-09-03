import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { MatchResult } from '../lib/match'
import { MatchBar, MatchBreakdown, MatchRing } from './Match'

export interface MatchCandidate {
  id: string
  name: string
  /** 名前の下に出す補足（ステータスバッジや条件など） */
  subtitle?: ReactNode
  match: MatchResult
  /** 名前クリック時の遷移先 */
  to: string
}

/**
 * 詳細ページのマッチ候補リスト。候補は全件受け取り、初期表示は initialCount 件まで。
 * 内訳の開閉状態も内部で持つ。
 */
const MatchCandidates = ({
  candidates,
  empty,
  initialCount = 5,
}: {
  candidates: MatchCandidate[]
  empty?: ReactNode
  initialCount?: number
}) => {
  const [openId, setOpenId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  if (candidates.length === 0) {
    return empty ? <p className="muted small">{empty}</p> : null
  }

  const visible = expanded ? candidates : candidates.slice(0, initialCount)
  const rest = candidates.length - visible.length

  return (
    <>
      {visible.map((c, i) => (
        <div
          key={c.id}
          style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <MatchRing score={c.match.score} />
            <div style={{ minWidth: 0 }}>
              <Link to={c.to} style={{ fontWeight: 700 }}>
                {c.name}
              </Link>
              {c.subtitle && <div style={{ marginTop: 2 }}>{c.subtitle}</div>}
              <div style={{ marginTop: 4 }}>
                <MatchBar score={c.match.score} />
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm"
            style={{ marginTop: 8 }}
            onClick={() => setOpenId(openId === c.id ? null : c.id)}
          >
            {openId === c.id ? '内訳を閉じる' : 'マッチ率の内訳'}
          </button>
          {openId === c.id && (
            <div style={{ marginTop: 10 }}>
              <MatchBreakdown match={c.match} />
            </div>
          )}
        </div>
      ))}

      {(rest > 0 || expanded) && (
        <button className="btn btn-sm btn-block" style={{ marginTop: 12 }} onClick={() => setExpanded(!expanded)}>
          {expanded ? '上位のみ表示' : `残り ${rest} 件を表示`}
        </button>
      )}
    </>
  )
}

export default MatchCandidates
