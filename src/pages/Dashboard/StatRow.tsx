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
  <div className="stat-row">
    {stats.map((s) =>
      s.onClick ? (
        <button
          key={s.label}
          type="button"
          className={`card stat stat-button${s.alert ? ' stat-alert' : ''}`}
          onClick={s.onClick}
          disabled={s.disabled}
        >
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
        </button>
      ) : (
        <div key={s.label} className={`card stat${s.alert ? ' stat-alert' : ''}`}>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
        </div>
      ),
    )}
  </div>
)

export default StatRow
