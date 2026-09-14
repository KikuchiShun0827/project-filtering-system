import { css, cx } from '@emotion/css'
import type { CSSProperties } from 'react'
import { matchRank } from '../lib/match'

/** マッチ率の数値（例: 85%）。高・中・低で色が変わる */
export const MatchScore = ({ score }: { score: number }) => (
  <span className={cx(styles.score, matchRank(score))}>
    {score}
    <span className={styles.unit}>%</span>
  </span>
)

/** マッチ率の横棒グラフ */
export const MatchBar = ({ score }: { score: number }) => (
  <span className={cx(styles.bar, matchRank(score))}>
    <span style={{ width: `${score}%` }} />
  </span>
)

/** マッチ率の円グラフ */
export const MatchRing = ({ score }: { score: number }) => (
  <div className={cx(styles.ring, matchRank(score))} style={{ '--value': score } as CSSProperties}>
    <div>{score}%</div>
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
}
