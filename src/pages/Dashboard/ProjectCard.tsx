import { useMemo, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CardMenu from '../../components/CardMenu'
import { Section } from '../../components/Page'
import { MAX_MATCH_RESULTS, rankProfiles } from '../../lib/match'
import { useData, type ProjectItem } from '../../store/DataContext'
import { StatusBadge } from '../../components/ui'
import { useSettings } from '../../store/SettingsContext'
import { IMPORTANCE_LABEL, WORK_STYLE_LABEL } from '../../types'
import MailMeta from './MailMeta'
import { mailMenuItems } from './mailMenu'
import MatchPanel from './MatchPanel'

const ProjectCard = ({ item }: { item: ProjectItem }) => {
  const { engineers, setLabel, deleteMail } = useData()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const { mail, project } = item

  const rows = useMemo(
    () =>
      (project ? rankProfiles(engineers, project, MAX_MATCH_RESULTS) : []).map((r) => ({
        id: r.profile.id,
        name: r.profile.name,
        tag: <StatusBadge status={r.profile.status} />,
        note: `必須 ${r.match.mustHit}/${r.match.mustTotal}`,
        score: r.match.score,
        to: `/engineers/${r.profile.id}`,
      })),
    [engineers, project],
  )

  /** カードの余白部分のクリックで案件詳細へ。カード内の操作要素は素通しする */
  const openDetail = (e: MouseEvent<HTMLElement>) => {
    if (!project) return
    if ((e.target as HTMLElement).closest('a, button, select, input, .match-row')) return
    navigate(`/projects/${project.id}`)
  }

  const head = (
    <div className="item-head">
      <div style={{ minWidth: 0 }}>
        <h3 className="item-subject">
          {project ? <Link to={`/projects/${project.id}`}>{mail.subject}</Link> : mail.subject}
        </h3>
        <MailMeta mail={mail} />
      </div>
      <CardMenu items={mailMenuItems(mail, setLabel, deleteMail)} />
    </div>
  )

  return (
    <Section className={project ? 'card-clickable' : undefined} onClick={openDetail}>
      {!project ? (
        <>
          {head}
          <p className="muted small" style={{ marginTop: 12 }}>
            このメールからは案件要件が抽出されていません（AI 解析の対象外、または手動でラベルを変更したメールです）。
          </p>
        </>
      ) : (
        <div className="item-body">
          <div>
            {head}
            <p className="small muted" style={{ margin: '10px 0 0' }}>
              {project.summary}
            </p>
            <dl className="spec-grid">
              <div className="spec">
                <dt>取引先</dt>
                <dd>{project.client}</dd>
              </div>
              <div className="spec">
                <dt>勤務地 / 形態</dt>
                <dd>
                  {project.location}・{WORK_STYLE_LABEL[project.workStyle]}
                </dd>
              </div>
              <div className="spec">
                <dt>単価</dt>
                <dd>
                  {project.rateMin}〜{project.rateMax} 万円
                </dd>
              </div>
              <div className="spec">
                <dt>開始 / 期間</dt>
                <dd>
                  {project.startFrom}〜（{project.period}）
                </dd>
              </div>
            </dl>

            <div className="section-label">要件</div>
            <div className="chip-row">
              {project.requirements.map((r) => (
                <span key={r.id} className={`badge badge-${r.importance}`}>
                  {r.label}
                  {r.minYears ? ` ${r.minYears}年+` : ''}
                  <span style={{ opacity: 0.7, marginLeft: 2 }}>／{IMPORTANCE_LABEL[r.importance]}</span>
                </span>
              ))}
            </div>
          </div>

          <MatchPanel label="マッチする自社要員" rows={rows} visibleRows={settings.matchCount} />
        </div>
      )}
    </Section>
  )
}

export default ProjectCard
