import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Section } from '../Page'
import {
  ASSIGNMENT_LABEL,
  WORK_STYLE_LABEL,
  type AssignmentStatus,
  type Engineer,
  type Skill,
  type WorkStyle,
} from '../../types'
import ConditionFields, { defaultConditions } from './ConditionFields'
import SkillFields, { emptySkill } from './SkillFields'

const today = () => new Date().toISOString().slice(0, 10)

const GENDERS: Engineer['gender'][] = ['男性', '女性', '回答なし']

export type EngineerFormValues = Omit<Engineer, 'id'>

/**
 * 要員の入力フォーム。追加画面・編集画面で共用する見た目と入力処理のみを持ち、
 * 保存先や遷移先は呼び出し側が onSubmit で決める。
 */
const EngineerForm = ({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Engineer
  submitLabel: string
  onSubmit: (values: EngineerFormValues) => void
}) => {
  const navigate = useNavigate()

  const [name, setName] = useState(initial?.name ?? '')
  const [age, setAge] = useState(initial?.age ?? 30)
  const [gender, setGender] = useState<Engineer['gender']>(initial?.gender ?? '回答なし')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [workAreas, setWorkAreas] = useState(initial?.workAreas.join(', ') ?? '')
  const [workStyle, setWorkStyle] = useState<WorkStyle>(initial?.workStyle ?? 'hybrid')
  const [desiredRate, setDesiredRate] = useState(initial?.desiredRate ?? 60)
  const [availableFrom, setAvailableFrom] = useState(initial?.availableFrom ?? today())
  const [status, setStatus] = useState<AssignmentStatus>(initial?.status ?? 'waiting')
  const [currentProject, setCurrentProject] = useState(initial?.currentProject ?? '')
  const [waitingSince, setWaitingSince] = useState(initial?.waitingSince ?? today())
  const [summary, setSummary] = useState(initial?.summary ?? '')
  const [highlights, setHighlights] = useState(initial?.highlights.join('\n') ?? '')
  const [skills, setSkills] = useState<Skill[]>(initial?.skills.length ? initial.skills : [emptySkill()])
  const [conditions, setConditions] = useState(initial?.conditions ?? defaultConditions())
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim() === '') {
      setError('氏名は必須です。')
      return
    }

    onSubmit({
      name: name.trim(),
      age,
      gender,
      location: location.trim(),
      workAreas: workAreas
        .split(/[,、・\s]+/)
        .map((a) => a.trim())
        .filter(Boolean),
      workStyle,
      desiredRate,
      availableFrom,
      status,
      currentProject: status === 'waiting' ? undefined : currentProject.trim() || undefined,
      waitingSince: status === 'waiting' ? waitingSince : undefined,
      summary: summary.trim(),
      highlights: highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
      // 名称が空のスキル行は登録しない
      skills: skills.filter((s) => s.name.trim() !== '').map((s) => ({ ...s, name: s.name.trim() })),
      conditions: conditions.map((c) => ({ ...c, note: c.note?.trim() || undefined })),
    })
  }

  return (
    <form onSubmit={submit} className="stack" style={{ maxWidth: 960 }}>
      <Section label="基本情報">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">氏名</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="age">年齢</label>
            <input
              id="age"
              type="number"
              min={15}
              max={80}
              value={age}
              onChange={(e) => setAge(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div className="field">
            <label htmlFor="gender">性別</label>
            <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as Engineer['gender'])}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="location">所在地</label>
            <input
              id="location"
              type="text"
              placeholder="東京都世田谷区"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="summary">概要</label>
          <textarea
            id="summary"
            rows={2}
            placeholder="フロントエンド中心のフルスタック。React/TypeScript で SPA 設計から実装まで一貫対応。"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="highlights">補足（1 行につき 1 件）</label>
          <textarea id="highlights" rows={3} value={highlights} onChange={(e) => setHighlights(e.target.value)} />
        </div>
      </Section>

      <Section label="稼働条件">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="workAreas">勤務可能エリア（カンマ区切り）</label>
            <input
              id="workAreas"
              type="text"
              placeholder="東京, 神奈川, リモート"
              value={workAreas}
              onChange={(e) => setWorkAreas(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="workStyle">稼働形態</label>
            <select id="workStyle" value={workStyle} onChange={(e) => setWorkStyle(e.target.value as WorkStyle)}>
              {(Object.keys(WORK_STYLE_LABEL) as WorkStyle[]).map((w) => (
                <option key={w} value={w}>
                  {WORK_STYLE_LABEL[w]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="desiredRate">希望単価（万円〜）</label>
            <input
              id="desiredRate"
              type="number"
              min={0}
              max={300}
              value={desiredRate}
              onChange={(e) => setDesiredRate(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div className="field">
            <label htmlFor="availableFrom">稼働可能日</label>
            <input
              id="availableFrom"
              type="date"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="status">ステータス</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as AssignmentStatus)}>
              {(Object.keys(ASSIGNMENT_LABEL) as AssignmentStatus[]).map((s) => (
                <option key={s} value={s}>
                  {ASSIGNMENT_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          {status === 'waiting' ? (
            <div className="field">
              <label htmlFor="waitingSince">待機開始日</label>
              <input
                id="waitingSince"
                type="date"
                value={waitingSince}
                onChange={(e) => setWaitingSince(e.target.value)}
              />
            </div>
          ) : (
            <div className="field">
              <label htmlFor="currentProject">{status === 'assigned' ? '稼働中の案件名' : '参画予定の案件名'}</label>
              <input
                id="currentProject"
                type="text"
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
              />
            </div>
          )}
        </div>
      </Section>

      <Section label="所持技術・資格">
        <SkillFields skills={skills} onChange={setSkills} />
      </Section>

      <Section label="就業希望条件の重要度">
        <ConditionFields conditions={conditions} onChange={setConditions} />
      </Section>

      <div className="form-actions">
        {error && <span className="form-error">{error}</span>}
        <button type="button" className="btn" onClick={() => navigate(-1)}>
          キャンセル
        </button>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default EngineerForm
