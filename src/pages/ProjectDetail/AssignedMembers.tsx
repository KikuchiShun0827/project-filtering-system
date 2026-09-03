import { Link } from 'react-router-dom'
import { matchRank } from '../../lib/match'
import type { Assignment } from '../../types'

/** この案件に参画が確定している要員の一覧 */
const AssignedMembers = ({ assignments }: { assignments: Assignment[] }) => (
  <>
    {assignments.map((a) => (
      <div key={a.id} className="assign-row">
        <div className="chip-row">
          {a.members.map((m) => (
            <Link key={m.engineerId} to={`/engineers/${m.engineerId}`} className={`badge badge-${matchRank(m.matchScore)}`}>
              {m.engineerName} {m.matchScore}%
            </Link>
          ))}
        </div>
        <div className="muted small">
          {a.startDate} 〜 {a.endDate ?? '未定'}
          {a.rate !== undefined && ` ／ ${a.rate} 万円`}
        </div>
        {a.note && <div className="muted small">{a.note}</div>}
      </div>
    ))}
  </>
)

export default AssignedMembers
