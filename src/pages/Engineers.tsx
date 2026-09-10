import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/Page'
import { StatusBadge, waitingDays } from '../components/ui'
import { useData } from '../store/DataContext'
import { ASSIGNMENT_LABEL, WORK_STYLE_LABEL, type AssignmentStatus } from '../types'

type StatusFilter = 'all' | AssignmentStatus

/** 一覧の並び順（手が空いている要員から先に見せる） */
const STATUS_ORDER: Record<AssignmentStatus, number> = { waiting: 0, upcoming: 1, assigned: 2 }

const Engineers = () => {
  const { engineers } = useData()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')

  const kw = keyword.trim().toLowerCase()
  const list = engineers
    .filter((e) => {
      const matchStatus = status === 'all' || e.status === status
      const text = `${e.name} ${e.company} ${e.location} ${e.workAreas.join(' ')} ${e.skills.map((s) => s.name).join(' ')}`
      return matchStatus && (kw === '' || text.toLowerCase().includes(kw))
    })
    // 待機中 → 参画予定 → 稼働中。待機中は待機期間の長い順、参画予定は稼働可能日の早い順
    .sort((a, b) => {
      if (a.status !== b.status) return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (a.status === 'waiting') return (a.waitingSince ?? '9999-12-31').localeCompare(b.waitingSince ?? '9999-12-31')
      if (a.status === 'upcoming') return a.availableFrom.localeCompare(b.availableFrom)
      return a.name.localeCompare(b.name, 'ja')
    })

  return (
    <>
      <PageHeader
        title="要員管理"
        actions={
          <Link className="btn btn-primary" to="/engineers/new">
            要員を追加
          </Link>
        }
      />

      <div className="toolbar">
        <input
          className="grow"
          type="text"
          placeholder="氏名・所属会社・スキル・エリアで絞り込み"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
          <option value="all">すべてのステータス</option>
          {(Object.keys(ASSIGNMENT_LABEL) as AssignmentStatus[]).map((s) => (
            <option key={s} value={s}>
              {ASSIGNMENT_LABEL[s]}
            </option>
          ))}
        </select>
        <span className="muted small">{list.length} 名</span>
      </div>

      <div className="card table-wrap">
        <table className="table clickable">
          <thead>
            <tr>
              <th>氏名</th>
              <th>所属会社</th>
              <th>年齢 / 性別</th>
              <th>所在地</th>
              <th>勤務可能エリア / 形態</th>
              <th>主要スキル</th>
              <th>希望単価</th>
              <th>ステータス</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id} onClick={() => navigate(`/engineers/${e.id}`)}>
                <td style={{ fontWeight: 700 }}>{e.name}</td>
                <td className="muted">{e.company}</td>
                <td className="muted">
                  {e.age}歳 / {e.gender}
                </td>
                <td className="muted">{e.location}</td>
                <td className="muted">
                  {e.workAreas.join('・')}
                  <br />
                  {WORK_STYLE_LABEL[e.workStyle]}
                </td>
                <td>
                  <div className="chip-row">
                    {e.skills.slice(0, 4).map((s) => (
                      <span key={s.name} className="badge badge-plain">
                        {s.name} {s.years}年
                      </span>
                    ))}
                    {e.skills.length > 4 && <span className="muted small">+{e.skills.length - 4}</span>}
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{e.desiredRate} 万〜</td>
                <td>
                  <StatusBadge status={e.status} since={e.waitingSince} />
                  {e.status === 'assigned' && e.currentProject && (
                    <div className="muted small">{e.currentProject}</div>
                  )}
                  {e.status === 'waiting' && e.waitingSince && (
                    <div className="muted small">{e.waitingSince} から {waitingDays(e.waitingSince)} 日</div>
                  )}
                </td>
                <td>
                  {/* 行クリックの詳細遷移を打ち消して編集画面へ */}
                  <Link
                    className="btn btn-sm"
                    to={`/engineers/${e.id}/edit`}
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <EmptyState card={false}>該当する要員がいません。</EmptyState>}
      </div>
    </>
  )
}

export default Engineers
