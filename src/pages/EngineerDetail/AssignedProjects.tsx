import { Link } from 'react-router-dom'
import { matchRank } from '../../lib/match'
import type { Assignment } from '../../types'

/** この要員の参画が確定している案件の一覧 */
const AssignedProjects = ({ assignments, engineerId }: { assignments: Assignment[]; engineerId: string }) => (
  <>
    {assignments.map((a) => {
      const member = a.members.find((m) => m.engineerId === engineerId)
      return (
        <div key={a.id} className="assign-row">
          <div className="chip-row" style={{ alignItems: 'center' }}>
            <Link to={`/projects/${a.projectId}`} style={{ fontWeight: 700 }}>
              {a.projectTitle}
            </Link>
            {member && <span className={`badge badge-${matchRank(member.matchScore)}`}>{member.matchScore}%</span>}
          </div>
          <div className="muted small">
            {a.client} ／ {a.startDate} 〜 {a.endDate ?? '未定'}
            {a.rate !== undefined && ` ／ ${a.rate} 万円`}
          </div>
          {a.note && <div className="muted small">{a.note}</div>}
        </div>
      )
    })}
  </>
)

export default AssignedProjects
