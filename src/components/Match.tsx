import type { CSSProperties } from 'react'
import { matchRank, type MatchResult } from '../lib/match'
import { IMPORTANCE_LABEL } from '../types'

export const MatchScore = ({ score }: { score: number }) => (
  <span className={`match-score ${matchRank(score)}`}>
    {score}
    <span className="unit">%</span>
  </span>
)

export const MatchBar = ({ score }: { score: number }) => (
  <span className={`match-bar ${matchRank(score)}`}>
    <span style={{ width: `${score}%` }} />
  </span>
)

export const MatchRing = ({ score }: { score: number }) => (
  <div className={`match-ring ${matchRank(score)}`} style={{ '--value': score } as CSSProperties}>
    <div>{score}%</div>
  </div>
)

/** マッチ率の内訳（要件・条件ごとの判定） */
export const MatchBreakdown = ({ match }: { match: MatchResult }) => (
  <div>
    <div className="section-label">要件の充足状況（必須 {match.mustHit}/{match.mustTotal}）</div>
    {match.requirements.map((r) => (
      <div key={r.requirement.id} className="req-row">
        <span className={`req-icon ${r.status}`}>{r.status === 'hit' ? '◎' : r.status === 'partial' ? '△' : '×'}</span>
        <span style={{ fontWeight: 600 }}>{r.requirement.label}</span>
        <span className={`badge badge-${r.requirement.importance}`}>{IMPORTANCE_LABEL[r.requirement.importance]}</span>
        <span className="muted small" style={{ marginLeft: 'auto', textAlign: 'right' }}>
          {r.matchedSkill
            ? `保有 ${r.matchedSkill.years}年`
            : '該当スキルなし'}
          {r.requirement.minYears ? `（要 ${r.requirement.minYears}年）` : ''}
        </span>
      </div>
    ))}

    <div className="section-label" style={{ marginTop: 14 }}>
      就業条件の適合
    </div>
    {match.conditions.map((c) => (
      <div key={c.key} className="req-row">
        <span className={`req-icon ${c.score >= 0.9 ? 'hit' : c.score >= 0.4 ? 'partial' : 'miss'}`}>
          {c.score >= 0.9 ? '◎' : c.score >= 0.4 ? '△' : '×'}
        </span>
        <span style={{ fontWeight: 600 }}>{c.label}</span>
        <span className={`badge badge-${c.importance}`}>{IMPORTANCE_LABEL[c.importance]}</span>
        <span className="muted small" style={{ marginLeft: 'auto', textAlign: 'right' }}>
          {c.detail}
        </span>
      </div>
    ))}
  </div>
)
