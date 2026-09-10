import { useMemo, useState } from 'react'
import { matchRank, rankProfiles } from '../lib/match'
import { useData } from '../store/DataContext'
import {
  APPLICATION_STATUS_FLOW,
  APPLICATION_STATUS_LABEL,
  ASSIGNMENT_LABEL,
  type ApplicationDraft,
  type ApplicationStatus,
  type Project,
} from '../types'
import Modal from './Modal'

/** 応募（提案）の登録モーダル。選んだ要員ぶんの応募をまとめて作る */
const ApplicationModal = ({
  project,
  company,
  initialMemberIds = [],
  onSubmit,
  onClose,
}: {
  project: Project
  /** 案件メールの送信元会社 */
  company: string
  /** 最初から選択しておく要員（要員詳細から開いたとき用） */
  initialMemberIds?: string[]
  onSubmit: (draft: Omit<ApplicationDraft, 'projectId' | 'projectTitle' | 'company'>) => void
  onClose: () => void
}) => {
  const { engineers } = useData()
  const [memberIds, setMemberIds] = useState<string[]>(initialMemberIds)
  const [status, setStatus] = useState<ApplicationStatus>('considering')
  const [appliedAt, setAppliedAt] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  // マッチ率の高い順に並べた全要員（プルダウンの並び順に使う）
  const options = useMemo(
    () => rankProfiles(engineers, project).map((r) => ({ engineer: r.profile, score: r.match.score })),
    [engineers, project],
  )

  const selected = memberIds
    .map((id) => options.find((o) => o.engineer.id === id))
    .filter((o): o is (typeof options)[number] => o !== undefined)

  const add = (id: string) => {
    if (!id || memberIds.includes(id)) return
    setMemberIds([...memberIds, id])
    setError('')
  }

  const submit = () => {
    if (selected.length === 0) {
      setError('応募する要員を選択してください。')
      return
    }
    if (!appliedAt) {
      setError('応募日を入力してください。')
      return
    }
    onSubmit({
      members: selected.map((o) => ({
        engineerId: o.engineer.id,
        engineerName: o.engineer.name,
        matchScore: o.score,
      })),
      status,
      appliedAt,
      note: note.trim() || undefined,
    })
  }

  return (
    <Modal title="応募" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <div className="field">
          <label>案件</label>
          <div className="modal-readonly">
            <div style={{ fontWeight: 700 }}>{project.title}</div>
            <div className="muted small">
              {company} ／ {project.location} ／ {project.rateMin}〜{project.rateMax} 万円
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="apply-engineer">応募する要員（複数選択可）</label>
          {/* 選ぶたびに下のチップへ追加し、プルダウンは未選択に戻す */}
          <select id="apply-engineer" value="" onChange={(e) => add(e.target.value)}>
            <option value="">要員を追加</option>
            {options
              .filter((o) => !memberIds.includes(o.engineer.id))
              .map((o) => (
                <option key={o.engineer.id} value={o.engineer.id}>
                  {o.engineer.name}（{ASSIGNMENT_LABEL[o.engineer.status]}・{o.score}%）
                </option>
              ))}
          </select>

          {selected.length > 0 && (
            <div className="chip-row" style={{ marginTop: 8 }}>
              {selected.map((o) => (
                <span key={o.engineer.id} className={`badge badge-${matchRank(o.score)} member-chip`}>
                  {o.engineer.name} {o.score}%
                  <button
                    type="button"
                    aria-label={`${o.engineer.name}を外す`}
                    onClick={() => setMemberIds(memberIds.filter((id) => id !== o.engineer.id))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="apply-status">状態</label>
            <select
              id="apply-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
            >
              {APPLICATION_STATUS_FLOW.map((s) => (
                <option key={s} value={s}>
                  {APPLICATION_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="apply-date">応募日</label>
            <input
              id="apply-date"
              type="date"
              value={appliedAt}
              onChange={(e) => {
                setAppliedAt(e.target.value)
                setError('')
              }}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="apply-note">備考</label>
          <textarea id="apply-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="form-actions">
          {error && <span className="form-error">{error}</span>}
          <button type="button" className="btn" onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" className="btn btn-primary">
            応募を登録
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ApplicationModal
