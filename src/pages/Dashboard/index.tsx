import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, PageHeader } from '../../components/Page'
import { useData, withinDays } from '../../store/DataContext'
import { useSettings } from '../../store/SettingsContext'
import OtherCard from './OtherCard'
import ProjectCard from './ProjectCard'
import StatRow from './StatRow'
import SyncModal from './SyncModal'
import TalentCard from './TalentCard'
import Tabs, { type TabKey } from './Tabs'

const Dashboard = () => {
  const { projectItems, talentItems, otherMails, unclassifiedCount, classifying, lastResult, engineers, assignments } =
    useData()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabKey>('project')
  const [syncOpen, setSyncOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  /** 閉じた通知。再度読み込むと lastResult が別オブジェクトになり、通知が復活する */
  const [dismissed, setDismissed] = useState<typeof lastResult>(null)

  const kw = keyword.trim().toLowerCase()
  const hit = (text: string) => kw === '' || text.toLowerCase().includes(kw)

  // 設定の表示期間より古いメールは一覧・件数の両方から外す
  const inPeriod = (receivedAt: string) => withinDays(receivedAt, settings.displayDays)
  // 参画が決まった案件は募集中ではないので一覧から外す（参画案件一覧から辿れる）
  const assignedProjectIds = new Set(assignments.map((a) => a.projectId))
  const periodProjects = projectItems.filter((i) => inPeriod(i.mail.receivedAt))
  const visibleProjects = periodProjects.filter((i) => !i.project || !assignedProjectIds.has(i.project.id))
  const assignedHidden = periodProjects.length - visibleProjects.length
  const visibleTalents = talentItems.filter((i) => inPeriod(i.mail.receivedAt))
  const visibleOthers = otherMails.filter((m) => inPeriod(m.receivedAt))

  const filteredProjects = visibleProjects.filter((i) =>
    hit(`${i.mail.subject} ${i.mail.fromName} ${i.project?.requirements.map((r) => r.label).join(' ') ?? ''}`),
  )
  const filteredTalents = visibleTalents.filter((i) =>
    hit(`${i.mail.subject} ${i.mail.fromName} ${i.talent?.skills.map((s) => s.name).join(' ') ?? ''}`),
  )
  const filteredOthers = visibleOthers.filter((m) => hit(`${m.subject} ${m.fromName}`))

  const waiting = engineers.filter((e) => e.status === 'waiting').length

  return (
    <>
      <PageHeader
        title="案件・人材一覧"
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setSyncOpen(true)}
            disabled={classifying || unclassifiedCount === 0}
          >
            {classifying ? '分類中…' : `メールを読み込む${unclassifiedCount > 0 ? `（${unclassifiedCount}件）` : ''}`}
          </button>
        }
      />

      {syncOpen && <SyncModal onClose={() => setSyncOpen(false)} />}

      {lastResult && lastResult !== dismissed && (
        <div className="notice">
          <div className="notice-body">
            <span>読み込み完了</span>
            <span>
              過去 {lastResult.days} 日ぶんから、案件 {lastResult.project} 件 / 人材 {lastResult.talent} 件 / その他{' '}
              {lastResult.other} 件を分類し、Gmail ラベルを付与しました。分類済みメールは次回の読み込み対象から除外されます。
            </span>
          </div>
          <button type="button" className="notice-close" aria-label="通知を閉じる" onClick={() => setDismissed(lastResult)}>
            ×
          </button>
        </div>
      )}

      <StatRow
        stats={[
          {
            label: '未分類メール',
            value: unclassifiedCount,
            onClick: () => setSyncOpen(true),
            disabled: classifying || unclassifiedCount === 0,
            alert: unclassifiedCount > 0,
          },
          { label: '案件', value: visibleProjects.length, onClick: () => setTab('project') },
          { label: '人材', value: visibleTalents.length, onClick: () => setTab('talent') },
          { label: 'その他', value: visibleOthers.length, onClick: () => setTab('other') },
          { label: '待機中の自社要員', value: waiting, onClick: () => navigate('/engineers') },
        ]}
      />

      <Tabs
        tab={tab}
        counts={{ project: visibleProjects.length, talent: visibleTalents.length, other: visibleOthers.length }}
        onChange={setTab}
      />

      <div className="toolbar">
        <input
          className="grow"
          type="text"
          placeholder="件名・送信元・スキルで絞り込み"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span className="muted small">
          過去 {settings.displayDays} 日ぶんを表示
          {tab === 'project' && assignedHidden > 0 && `／参画済み ${assignedHidden} 件は非表示`}
        </span>
      </div>

      {tab === 'project' && (
        <div className="list">
          {filteredProjects.map((item) => (
            <ProjectCard key={item.mail.id} item={item} />
          ))}
          {filteredProjects.length === 0 && <EmptyState>該当する案件メールがありません。</EmptyState>}
        </div>
      )}

      {tab === 'talent' && (
        <div className="list">
          {filteredTalents.map((item) => (
            <TalentCard key={item.mail.id} item={item} />
          ))}
          {filteredTalents.length === 0 && <EmptyState>該当する人材メールがありません。</EmptyState>}
        </div>
      )}

      {tab === 'other' && (
        <div className="list">
          {filteredOthers.map((mail) => (
            <OtherCard key={mail.id} mail={mail} />
          ))}
          {filteredOthers.length === 0 && <EmptyState>該当するメールがありません。</EmptyState>}
        </div>
      )}
    </>
  )
}

export default Dashboard
