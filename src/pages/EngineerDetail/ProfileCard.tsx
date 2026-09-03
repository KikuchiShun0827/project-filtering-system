import { StatusBadge, waitingDays } from '../../components/ui'
import { useData } from '../../store/DataContext'
import { ASSIGNMENT_LABEL, WORK_STYLE_LABEL, type AssignmentStatus, type Engineer } from '../../types'

/** 氏名・ステータス・基本スペック */
const ProfileCard = ({ engineer }: { engineer: Engineer }) => {
  const { updateEngineer } = useData()

  return (
    <>
      <div className="profile-head">
        <div className="avatar" style={{ width: 52, height: 52, fontSize: 20 }}>
          {engineer.name[0]}
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 className="profile-name">{engineer.name}</h2>
          <div className="muted small">
            {engineer.age}歳 / {engineer.gender} / {engineer.location}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <StatusBadge status={engineer.status} since={engineer.waitingSince} />
          <div className="muted small" style={{ marginTop: 4 }}>
            {engineer.status === 'assigned'
              ? engineer.currentProject
              : engineer.status === 'waiting' && engineer.waitingSince
                ? `待機開始 ${engineer.waitingSince}（${waitingDays(engineer.waitingSince)}日経過）`
                : engineer.currentProject ?? ''}
          </div>
        </div>
      </div>

      <p className="small muted" style={{ marginBottom: 4 }}>
        {engineer.summary}
      </p>

      <dl className="spec-grid">
        <div className="spec">
          <dt>勤務可能エリア</dt>
          <dd>{engineer.workAreas.join('・')}</dd>
        </div>
        <div className="spec">
          <dt>稼働形態</dt>
          <dd>{WORK_STYLE_LABEL[engineer.workStyle]}</dd>
        </div>
        <div className="spec">
          <dt>希望単価</dt>
          <dd>{engineer.desiredRate} 万円〜</dd>
        </div>
        <div className="spec">
          <dt>稼働可能日</dt>
          <dd>{engineer.availableFrom}</dd>
        </div>
        <div className="spec">
          <dt>ステータス</dt>
          <dd>
            <select
              value={engineer.status}
              onChange={(e) => updateEngineer(engineer.id, { status: e.target.value as AssignmentStatus })}
              style={{ fontSize: 12, padding: '3px 8px' }}
            >
              {(Object.keys(ASSIGNMENT_LABEL) as AssignmentStatus[]).map((s) => (
                <option key={s} value={s}>
                  {ASSIGNMENT_LABEL[s]}
                </option>
              ))}
            </select>
          </dd>
        </div>
      </dl>
    </>
  )
}

export default ProfileCard
