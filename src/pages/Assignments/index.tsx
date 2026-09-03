import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssignmentModal from '../../components/AssignmentModal'
import { EmptyState, PageHeader } from '../../components/Page'
import { matchRank } from '../../lib/match'
import { useData } from '../../store/DataContext'
import type { Assignment } from '../../types'

const Assignments = () => {
  const { activeProjects, assignments, updateAssignment } = useData()
  const navigate = useNavigate()
  const [editing, setEditing] = useState<Assignment | null>(null)

  // 開始日が近い順（未来も過去も昇順）に並べる
  const list = [...assignments].sort((a, b) => a.startDate.localeCompare(b.startDate))

  return (
    <>
      <PageHeader title="参画案件一覧" actions={<span className="muted small">{list.length} 件</span>} />

      {editing && (
        <AssignmentModal
          title="参画予定の編集"
          submitLabel="保存"
          // 元メールが消えていると案件を引けないため null を許容する
          project={activeProjects.find((p) => p.id === editing.projectId) ?? null}
          assignment={editing}
          onClose={() => setEditing(null)}
          onSubmit={(draft) => {
            updateAssignment(editing.id, draft)
            setEditing(null)
          }}
        />
      )}

      <div className="card table-wrap">
        <table className="table clickable">
          <thead>
            <tr>
              <th>案件</th>
              <th>クライアント</th>
              <th>参画要員</th>
              <th>開始日</th>
              <th>終了日</th>
              <th>単価</th>
              <th>備考</th>
              {/* 操作列は内容ぶんだけに詰めて、ボタンを右端へ寄せる */}
              <th style={{ width: '1%' }} />
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} onClick={() => navigate(`/projects/${a.projectId}`)}>
                <td style={{ fontWeight: 700 }}>{a.projectTitle}</td>
                <td className="muted">{a.client}</td>
                <td>
                  <div className="chip-row">
                    {a.members.map((m) => (
                      <span key={m.engineerId} className={`badge badge-${matchRank(m.matchScore)}`}>
                        {m.engineerName} {m.matchScore}%
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{a.startDate}</td>
                <td style={{ whiteSpace: 'nowrap' }} className="muted">
                  {a.endDate ?? '未定'}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{a.rate ? `${a.rate} 万円` : '—'}</td>
                <td className="muted small">{a.note ?? '—'}</td>
                <td style={{ width: '1%', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {/* 行クリックの案件詳細遷移を打ち消して編集モーダルを開く */}
                  <button
                    className="btn btn-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditing(a)
                    }}
                  >
                    編集
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <EmptyState card={false}>参画中の案件はまだありません。案件詳細の「参画」から登録できます。</EmptyState>
        )}
      </div>
    </>
  )
}

export default Assignments
