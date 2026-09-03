import {
  ASSIGNMENT_LABEL,
  IMPORTANCE_LABEL,
  MAIL_LABEL,
  type AssignmentStatus,
  type Importance,
  type MailLabel,
} from '../types'

export const ImportanceBadge = ({ importance }: { importance: Importance }) => (
  <span className={`badge badge-${importance}`}>{IMPORTANCE_LABEL[importance]}</span>
)

export const StatusBadge = ({ status, since }: { status: AssignmentStatus; since?: string }) => (
  <span className={`badge ${status === 'waiting' ? 'badge-high' : status === 'upcoming' ? 'badge-want' : 'badge-plain'}`}>
    {ASSIGNMENT_LABEL[status]}
    {status === 'waiting' && since ? `（${waitingDays(since)}日）` : ''}
  </span>
)

export const waitingDays = (since: string) =>
  Math.max(0, Math.round((Date.now() - new Date(since).getTime()) / 86_400_000))

export const LabelBadge = ({ label }: { label: MailLabel }) => (
  <span className={`badge ${label === 'project' ? 'badge-must' : label === 'talent' ? 'badge-want' : 'badge-any'}`}>
    {MAIL_LABEL[label]}
  </span>
)

export const Switch = ({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) => (
  <button type="button" className={`switch${on ? ' on' : ''}`} aria-label={label} aria-pressed={on} onClick={onToggle} />
)

export const ImportanceSelector = ({
  value,
  onChange,
}: {
  value: Importance
  onChange: (v: Importance) => void
}) => (
  <span className="seg">
    {(['must', 'want', 'any'] as const).map((v) => (
      <button key={v} type="button" className={value === v ? 'on' : ''} onClick={() => onChange(v)}>
        {IMPORTANCE_LABEL[v]}
      </button>
    ))}
  </span>
)
