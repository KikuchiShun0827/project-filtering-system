import { css, cx } from '@emotion/css'
import type { CSSProperties } from 'react'
import { matchRank, type MatchResult } from '../lib/match'
import { IMPORTANCE_LABEL } from '../types'

export const MatchScore = ({ score }: { score: number }) => (
  <span className={cx(styles.score, matchRank(score))}>
    {score}
    <span className={styles.unit}>%</span>
  </span>
)

export const MatchBar = ({ score }: { score: number }) => (
  <span className={cx(styles.bar, matchRank(score))}>
    <span style={{ width: `${score}%` }} />
  </span>
)

export const MatchRing = ({ score }: { score: number }) => (
  <div className={cx(styles.ring, matchRank(score))} style={{ '--value': score } as CSSProperties}>
    <div>{score}%</div>
  </div>
)

/** マッチ率の内訳（要件・条件ごとの判定） */
export const MatchBreakdown = ({ match }: { match: MatchResult }) => (
  <div>
    <div className="section-label">要件の充足状況（必須 {match.mustHit}/{match.mustTotal}）</div>
    {match.requirements.map((r) => (
      <div key={r.requirement.id} className={styles.reqRow}>
        <span className={cx(styles.reqIcon, r.status)}>{r.status === 'hit' ? '◎' : r.status === 'partial' ? '△' : '×'}</span>
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
      <div key={c.key} className={styles.reqRow}>
        <span className={cx(styles.reqIcon, c.score >= 0.9 ? 'hit' : c.score >= 0.4 ? 'partial' : 'miss')}>
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

const styles = {
  /* flex にすると単位のベースラインがずれるので、ブロック内のインライン組みにする。
     block にしないとバーが同じ行に並んでしまう */
  score: css`
    display: block;
    font-weight: 800;
    line-height: 20px;
    font-variant-numeric: tabular-nums;

    &.high {
      color: var(--high);
    }

    &.mid {
      color: var(--mid);
    }

    &.low {
      color: var(--low);
    }
  `,

  unit: css`
    font-size: 11px;
    font-weight: 700;
    margin-left: 2px;
  `,

  bar: css`
    /* インラインのままだと height / overflow が効かず、バーが 0 高さで消える */
    display: block;
    height: 6px;
    border-radius: 999px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    overflow: hidden;

    & > span {
      display: block;
      height: 100%;
    }

    &.high > span {
      background: var(--high);
    }

    &.mid > span {
      background: var(--mid);
    }

    &.low > span {
      background: var(--low);
    }
  `,

  ring: css`
    --value: 0;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: conic-gradient(var(--ring-color) calc(var(--value) * 1%), var(--surface-2) 0);
    flex-shrink: 0;

    & > div {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: var(--surface);
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 16px;
      color: var(--ring-color);
    }

    &.high {
      --ring-color: var(--high);
    }

    &.mid {
      --ring-color: var(--mid);
    }

    &.low {
      --ring-color: var(--low);
    }
  `,

  reqRow: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;

    &:last-child {
      border-bottom: none;
    }
  `,

  reqIcon: css`
    width: 18px;
    text-align: center;
    font-weight: 800;

    &.hit {
      color: var(--high);
    }

    &.partial {
      color: var(--mid);
    }

    &.miss {
      color: var(--danger);
    }
  `,
}
