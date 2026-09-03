import { useMemo, useState } from 'react'
import { matchRank, rankProfiles } from '../lib/match'
import { useData } from '../store/DataContext'
import { ASSIGNMENT_LABEL, type Assignment, type AssignmentMember, type Project } from '../types'
import Modal from './Modal'

/** 参画モーダルで編集できる内容（案件そのものは変更しない） */
export interface AssignmentDraft {
  members: AssignmentMember[]
  startDate: string
  endDate?: string
  rate?: number
  note?: string
}

/**
 * 参画の登録・編集モーダル。
 * マッチ率は案件が残っているときだけ再計算し、案件が消えている編集時は登録時の値を表示する。
 */
const AssignmentModal = ({
  title,
  project,
  assignment,
  submitLabel = '確定',
  onSubmit,
  onClose,
}: {
  title: string
  /** マッチ率の算出元。元メールが消えている場合は null */
  project: Project | null
  /** 編集時の既存データ */
  assignment?: Assignment
  submitLabel?: string
  onSubmit: (draft: AssignmentDraft) => void
  onClose: () => void
}) => {
  const { engineers } = useData()
  const [memberIds, setMemberIds] = useState<string[]>(
    assignment?.members.map((m) => m.engineerId) ?? [],
  )
  const [startDate, setStartDate] = useState(assignment?.startDate ?? project?.startFrom ?? '')
  const [endDate, setEndDate] = useState(assignment?.endDate ?? '')
  const [rate, setRate] = useState(
    assignment?.rate !== undefined ? String(assignment.rate) : project ? String(project.rateMin) : '',
  )
  const [note, setNote] = useState(assignment?.note ?? '')
  const [error, setError] = useState('')

  /** 登録時のマッチ率（案件が消えていて再計算できないときの表示に使う） */
  const savedScores = useMemo(
    () => new Map(assignment?.members.map((m) => [m.engineerId, m.matchScore]) ?? []),
    [assignment],
  )

  // マッチ率の高い順に並べた全要員（プルダウンの並び順に使う）
  const options = useMemo(() => {
    if (project) {
      return rankProfiles(engineers, project).map((r) => ({ engineer: r.profile, score: r.match.score }))
    }
    return engineers.map((e) => ({ engineer: e, score: savedScores.get(e.id) ?? null }))
  }, [engineers, project, savedScores])

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
      setError('参画する要員を選択してください。')
      return
    }
    if (!startDate) {
      setError('開始日を入力してください。')
      return
    }
    if (endDate && endDate < startDate) {
      setError('終了日は開始日より後にしてください。')
      return
    }
    onSubmit({
      members: selected.map((o) => ({
        engineerId: o.engineer.id,
        engineerName: o.engineer.name,
        matchScore: o.score ?? savedScores.get(o.engineer.id) ?? 0,
      })),
      startDate,
      endDate: endDate || undefined,
      rate: rate === '' ? undefined : Number(rate),
      note: note.trim() || undefined,
    })
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <div className="field">
          <label>案件</label>
          <div className="modal-readonly">
            <div style={{ fontWeight: 700 }}>{project?.title ?? assignment?.projectTitle}</div>
            <div className="muted small">
              {project
                ? `${project.client} ／ ${project.location} ／ ${project.rateMin}〜${project.rateMax} 万円`
                : assignment?.client}
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="assign-engineer">参画する要員（複数選択可）</label>
          {/* 選ぶたびに下のチップへ追加し、プルダウンは未選択に戻す */}
          <select id="assign-engineer" value="" onChange={(e) => add(e.target.value)}>
            <option value="">要員を追加</option>
            {options
              .filter((o) => !memberIds.includes(o.engineer.id))
              .map((o) => (
                <option key={o.engineer.id} value={o.engineer.id}>
                  {o.engineer.name}（{ASSIGNMENT_LABEL[o.engineer.status]}
                  {o.score !== null && `・${o.score}%`}）
                </option>
              ))}
          </select>

          {selected.length > 0 && (
            <div className="chip-row" style={{ marginTop: 8 }}>
              {selected.map((o) => (
                <span
                  key={o.engineer.id}
                  className={`badge badge-${o.score === null ? 'plain' : matchRank(o.score)} member-chip`}
                >
                  {o.engineer.name}
                  {o.score !== null && ` ${o.score}%`}
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
            <label htmlFor="assign-start">開始日</label>
            <input
              id="assign-start"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setError('')
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="assign-end">終了日</label>
            <input
              id="assign-end"
              type="date"
              min={startDate || undefined}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setError('')
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="assign-rate">単価（万円/月）</label>
            <input id="assign-rate" type="number" min={0} value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="assign-note">備考</label>
          <textarea id="assign-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="form-actions">
          {error && <span className="form-error">{error}</span>}
          <button type="button" className="btn" onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AssignmentModal
