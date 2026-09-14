import { waitingDays } from '../lib/waitingDays'
import { ASSIGNMENT_LABEL, type AssignmentStatus } from '../types'

/** 要員の稼働状況（待機中・参画予定・参画中）のバッジ。待機中は経過日数も出す */
const StatusBadge = ({ status, since }: { status: AssignmentStatus; since?: string }) => (
  <span className={`badge ${status === 'waiting' ? 'badge-high' : status === 'upcoming' ? 'badge-want' : 'badge-plain'}`}>
    {ASSIGNMENT_LABEL[status]}
    {status === 'waiting' && since ? `（${waitingDays(since)}日）` : ''}
  </span>
)

export default StatusBadge
