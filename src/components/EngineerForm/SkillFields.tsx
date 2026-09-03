import { SKILL_CATEGORY_LABEL, type Skill, type SkillCategory } from '../../types'

export const emptySkill = (): Skill => ({ name: '', category: 'language', years: 1 })

/** スキル行の追加・削除・編集 */
const SkillFields = ({ skills, onChange }: { skills: Skill[]; onChange: (skills: Skill[]) => void }) => {
  const patch = (index: number, values: Partial<Skill>) =>
    onChange(skills.map((s, i) => (i === index ? { ...s, ...values } : s)))

  return (
    <>
      <p className="muted small" style={{ marginTop: 0 }}>
        名称が空の行は保存時に無視されます。経験年数はマッチ率の計算に使われます。
      </p>

      {skills.map((skill, i) => (
        <div key={i} className="skill-edit-row">
          <input
            type="text"
            placeholder="技術・資格名"
            value={skill.name}
            onChange={(e) => patch(i, { name: e.target.value })}
          />
          <select value={skill.category} onChange={(e) => patch(i, { category: e.target.value as SkillCategory })}>
            {(Object.keys(SKILL_CATEGORY_LABEL) as SkillCategory[]).map((c) => (
              <option key={c} value={c}>
                {SKILL_CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            max={50}
            aria-label="経験年数"
            value={skill.years}
            onChange={(e) => patch(i, { years: Math.max(0, Number(e.target.value) || 0) })}
          />
          <input
            type="text"
            placeholder="補足（任意）"
            value={skill.note ?? ''}
            onChange={(e) => patch(i, { note: e.target.value })}
          />
          <button
            type="button"
            className="btn btn-sm"
            disabled={skills.length === 1}
            onClick={() => onChange(skills.filter((_, index) => index !== i))}
          >
            削除
          </button>
        </div>
      ))}

      <button type="button" className="btn btn-sm" onClick={() => onChange([...skills, emptySkill()])}>
        スキルを追加
      </button>
    </>
  )
}

export default SkillFields
