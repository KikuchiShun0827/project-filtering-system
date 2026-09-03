export type TabKey = 'project' | 'talent' | 'other'

const TAB_LABEL: Record<TabKey, string> = {
  project: '案件一覧',
  talent: '人材一覧',
  other: 'その他',
}

const Tabs = ({
  tab,
  counts,
  onChange,
}: {
  tab: TabKey
  counts: Record<TabKey, number>
  onChange: (t: TabKey) => void
}) => (
  <div className="tabs">
    {(Object.keys(TAB_LABEL) as TabKey[]).map((k) => (
      <button key={k} className={`tab${tab === k ? ' active' : ''}`} onClick={() => onChange(k)}>
        {TAB_LABEL[k]}
        <span className="tab-count">{counts[k]}</span>
      </button>
    ))}
  </div>
)

export default Tabs
