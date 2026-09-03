import { IMPORTANCE_LABEL, SKILL_CATEGORY_LABEL, type Requirement } from '../../types'

/** 募集要件の一覧 */
const RequirementTable = ({ requirements }: { requirements: Requirement[] }) => (
  <div className="table-wrap">
    <table className="table">
      <thead>
        <tr>
          <th>項目</th>
          <th>区分</th>
          <th>重要度</th>
          <th>必要経験</th>
        </tr>
      </thead>
      <tbody>
        {requirements.map((r) => (
          <tr key={r.id}>
            <td style={{ fontWeight: 600 }}>{r.label}</td>
            <td className="muted">{SKILL_CATEGORY_LABEL[r.category]}</td>
            <td>
              <span className={`badge badge-${r.importance}`}>{IMPORTANCE_LABEL[r.importance]}</span>
            </td>
            <td className="muted">{r.minYears ? `${r.minYears}年以上` : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default RequirementTable
