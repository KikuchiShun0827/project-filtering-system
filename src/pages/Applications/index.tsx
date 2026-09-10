import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CardMenu, { type CardMenuItem } from '../../components/CardMenu'
import { EmptyState, PageHeader } from '../../components/Page'
import { matchRank } from '../../lib/match'
import { useData } from '../../store/DataContext'
import {
  APPLICATION_STATUS_FLOW,
  APPLICATION_STATUS_LABEL,
  hasUnreadReply,
  isClosedApplication,
  type Application,
  type ApplicationStatus,
} from '../../types'

type StatusFilter = 'all' | ApplicationStatus

const Applications = () => {
  const { applications, projectItems, setApplicationStatus, markReplyRead } = useData()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [noteOpen, setNoteOpen] = useState(true)

  const kw = keyword.trim().toLowerCase()
  const list = applications
    .filter((a) => {
      const text = `${a.projectTitle} ${a.company} ${a.engineerName}`.toLowerCase()
      return (filter === 'all' || a.status === filter) && (kw === '' || text.includes(kw))
    })
    // 動きのあった順（最終更新の新しい順）に見たい
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const inFilter = (s: StatusFilter) =>
    s === 'all' ? applications : applications.filter((a) => a.status === s)

  const countOf = (s: StatusFilter) => inFilter(s).length

  /** 未確認の返信の件数。1件以上あるタブは件数表示を赤に切り替える */
  const unreadOf = (s: StatusFilter) => inFilter(s).filter(hasUnreadReply).length

  const menuItems = (a: Application): CardMenuItem[] => {
    // 元メールが消えている案件は詳細を開けないので、その分の項目を落とす
    const item = projectItems.find((p) => p.project?.id === a.projectId)
    const items: CardMenuItem[] = []
    if (item) items.push({ label: '案件詳細を開く', onSelect: () => navigate(`/projects/${a.projectId}`) })
    // どちらも Gmail を直接開く想定。連携するまでは何もしない
    items.push({ label: 'メールを開く', onSelect: () => {} })
    items.push({ label: 'メールを作成する', onSelect: () => {} })
    if (hasUnreadReply(a)) items.push({ label: '返信を確認済みにする', onSelect: () => markReplyRead(a.id) })
    return items
  }

  return (
    <>
      <PageHeader title="応募管理" actions={<span className="muted small">{applications.length} 件</span>} />

      <div className="tabs">
        {(['all', ...APPLICATION_STATUS_FLOW] as StatusFilter[]).map((s) => {
          const unread = unreadOf(s)
          return (
            <button key={s} className={`tab${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
              {s === 'all' ? 'すべて' : APPLICATION_STATUS_LABEL[s]}
              {/* 未確認の返信があるあいだは、応募件数ではなく返信の件数を赤で出す */}
              <span className={`tab-count${unread > 0 ? ' alert' : ''}`}>{unread > 0 ? unread : countOf(s)}</span>
            </button>
          )
        })}
      </div>

      <div className="toolbar">
        <input
          className="grow"
          type="text"
          placeholder="案件名・会社名・要員名で絞り込み"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span className="muted small">{list.length} 件</span>
      </div>

      {/* 赤●が付く条件は本番と違うので、モックであることを明示しておく */}
      {noteOpen && applications.some((a) => a.repliedAt) && (
        <div className="mock-note">
          <span>
            <strong>モックの表示です。</strong>
            本来は Gmail に返信が届いた時点で赤●が付きます。この画面では送信を行わないため、「提案済」にした時点で
            返信が届いたものとして表示しています。
          </span>
          <button type="button" className="mock-note-close" aria-label="この説明を閉じる" onClick={() => setNoteOpen(false)}>
            ×
          </button>
        </div>
      )}

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>案件</th>
              <th>送信元会社</th>
              <th>応募要員</th>
              <th>状態</th>
              <th>応募日</th>
              <th>最終更新</th>
              <th>備考</th>
              <th aria-label="操作" />
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className={isClosedApplication(a.status) ? 'row-closed' : undefined}>
                <td style={{ fontWeight: 700 }}>{a.projectTitle}</td>
                <td className="muted">{a.company}</td>
                <td>
                  <span className={`badge badge-${matchRank(a.matchScore)}`}>
                    {a.engineerName} {a.matchScore}%
                  </span>
                </td>
                <td>
                  {/* セレクトそのものが現在の状態の表示を兼ねる */}
                  <select
                    className={`status-select app-status-${a.status}`}
                    value={a.status}
                    aria-label={`${a.projectTitle} の状態`}
                    onChange={(e) => setApplicationStatus(a.id, e.target.value as ApplicationStatus)}
                  >
                    {APPLICATION_STATUS_FLOW.map((s) => (
                      <option key={s} value={s}>
                        {APPLICATION_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{a.appliedAt}</td>
                <td style={{ whiteSpace: 'nowrap' }} className="muted">
                  {a.updatedAt}
                </td>
                <td className="muted small">{a.note ?? '—'}</td>
                <td className="col-menu">
                  {/* 返信が届いた応募はメニューボタンに赤いマークを重ねる */}
                  <CardMenu items={menuItems(a)} label={`${a.projectTitle} の操作`} alert={hasUnreadReply(a)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <EmptyState card={false}>
            {applications.length === 0
              ? '応募はまだありません。案件詳細の「応募」から登録できます。'
              : '該当する応募はありません。'}
          </EmptyState>
        )}
      </div>

    </>
  )
}

export default Applications
