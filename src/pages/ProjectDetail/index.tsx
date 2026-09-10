import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ApplicationModal from '../../components/ApplicationModal'
import MatchCandidates from '../../components/MatchCandidates'
import { DetailHeader, EmptyState, Section } from '../../components/Page'
import { StatusBadge } from '../../components/ui'
import { MAX_MATCH_RESULTS, rankProfiles } from '../../lib/match'
import { useData } from '../../store/DataContext'
import AssignedMembers from './AssignedMembers'
import MailSource from './MailSource'
import ProjectSpec from './ProjectSpec'
import RequirementTable from './RequirementTable'

const ProjectDetail = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [applyOpen, setApplyOpen] = useState(false)
  const { activeProjects, addApplications, assignments, engineers, mails } = useData()

  const project = activeProjects.find((p) => p.id === projectId)
  const mail = mails.find((m) => m.id === project?.mailId)

  // この案件に紐づく参画（開始日の昇順）
  const assigned = assignments
    .filter((a) => a.projectId === projectId)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))

  const candidates = useMemo(
    () =>
      (project ? rankProfiles(engineers, project, MAX_MATCH_RESULTS) : []).map((r) => ({
        id: r.profile.id,
        name: r.profile.name,
        subtitle: <StatusBadge status={r.profile.status} since={r.profile.waitingSince} />,
        match: r.match,
        to: `/engineers/${r.profile.id}`,
      })),
    [project, engineers],
  )

  if (!project) {
    return (
      <EmptyState>
        案件が見つかりません。<Link to="/">一覧へ戻る</Link>
      </EmptyState>
    )
  }

  return (
    <>
      <DetailHeader
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn">元メールを開く</button>
            <button className="btn btn-primary" onClick={() => setApplyOpen(true)}>
              応募
            </button>
          </div>
        }
      />

      {applyOpen && (
        <ApplicationModal
          project={project}
          company={mail?.fromCompany ?? project.client}
          onClose={() => setApplyOpen(false)}
          onSubmit={(draft) => {
            addApplications({
              projectId: project.id,
              projectTitle: project.title,
              company: mail?.fromCompany ?? project.client,
              ...draft,
            })
            // 登録後は内容を確認できるよう応募管理へ送る
            navigate('/applications')
          }}
        />
      )}

      <div className="detail-grid">
        <div className="stack">
          {assigned.length > 0 && (
            <Section label="参画メンバー">
              <AssignedMembers assignments={assigned} />
            </Section>
          )}

          <Section>
            <ProjectSpec project={project} mail={mail} />
          </Section>

          <Section label="募集要件">
            <RequirementTable requirements={project.requirements} />
          </Section>

          {mail?.body && (
            <Section label="元メール">
              <MailSource mail={mail} />
            </Section>
          )}
        </div>

        <Section label="マッチする自社要員">
          <MatchCandidates candidates={candidates} />
        </Section>
      </div>
    </>
  )
}

export default ProjectDetail
