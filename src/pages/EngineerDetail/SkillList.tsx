import { SKILL_CATEGORY_LABEL, type Engineer, type SkillCategory } from '../../types'

/** カテゴリ別の所持技術と補足メモ */
const SkillList = ({ engineer }: { engineer: Engineer }) => {
  const grouped = engineer.skills.reduce<Record<string, typeof engineer.skills>>((acc, s) => {
    ;(acc[s.category] ??= []).push(s)
    return acc
  }, {})

  return (
    <>
      {Object.entries(grouped).map(([category, skills]) => (
        <div key={category} style={{ marginBottom: 14 }}>
          <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>
            {SKILL_CATEGORY_LABEL[category as SkillCategory]}
          </div>
          <div className="skill-list">
            {skills.map((s) => (
              <div key={s.name} className="skill-row">
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span className="muted small">{s.years}年</span>
                {s.note && <span className="muted small">{s.note}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="section-label" style={{ marginTop: 6 }}>
        補足
      </div>
      <ul className="small muted" style={{ margin: 0, paddingLeft: 18 }}>
        {engineer.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </>
  )
}

export default SkillList
