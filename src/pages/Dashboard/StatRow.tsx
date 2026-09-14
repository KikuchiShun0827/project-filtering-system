import { css, cx } from '@emotion/css'

export interface Stat {
  label: string
  value: number
  /** 指定するとカードがボタンになる */
  onClick?: () => void
  disabled?: boolean
  /** 対応が必要な状態のときに赤く強調する */
  alert?: boolean
}

/** ページ上部の件数サマリ */
const StatRow = ({ stats }: { stats: Stat[] }) => (
  <div className={styles.row}>
    {stats.map((s) =>
      s.onClick ? (
        <button
          key={s.label}
          type="button"
          className={cx('card', styles.stat, styles.button, s.alert && 'alert')}
          onClick={s.onClick}
          disabled={s.disabled}
        >
          <div className={cx(styles.label, s.alert && 'alert')}>{s.label}</div>
          <div className={styles.value}>{s.value}</div>
        </button>
      ) : (
        <div key={s.label} className={cx('card', styles.stat, s.alert && 'alert')}>
          <div className={cx(styles.label, s.alert && 'alert')}>{s.label}</div>
          <div className={styles.value}>{s.value}</div>
        </div>
      ),
    )}
  </div>
)

export default StatRow

const styles = {
  row: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 18px;
  `,

  stat: css`
    padding: 14px 16px;

    /* 対応が必要な件数を持つカード */
    &.alert {
      background: var(--danger-soft);
      border-color: var(--danger);
      color: var(--danger);
    }
  `,

  button: css`
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;

    &:hover:not(:disabled) {
      border-color: var(--border-strong);
      background: var(--surface-2);
    }

    &:disabled {
      cursor: default;
    }

    &.alert:hover:not(:disabled) {
      background: var(--danger-soft);
      border-color: var(--danger);
      box-shadow: inset 0 0 0 1px var(--danger);
    }
  `,

  label: css`
    font-size: 11.5px;
    color: var(--text-muted);

    &.alert {
      color: inherit;
    }
  `,

  value: css`
    font-size: 22px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  `,
}
