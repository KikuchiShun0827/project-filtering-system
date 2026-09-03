import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AssignmentModal from '../../components/AssignmentModal'
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
  const [assignOpen, setAssignOpen] = useState(false)
  const { activeProjects, addAssignment, assignments, engineers, mails } = useData()

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
        title={project.title}
        description={
          <>
            {project.client}
            {mail && ` ／ 元メール：${mail.subject}`}
          </>
        }
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn">メール作成</button>
            <button className="btn btn-primary" onClick={() => setAssignOpen(true)}>
              参画
            </button>
          </div>
        }
      />

      {assignOpen && (
        <AssignmentModal
          title="参画予定"
          project={project}
          onClose={() => setAssignOpen(false)}
          onSubmit={(draft) => {
            addAssignment({ projectId: project.id, projectTitle: project.title, client: project.client, ...draft })
            // 確定後は登録内容を確認できるよう参画案件一覧へ送る
            navigate('/assignments')
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
            <ProjectSpec project={project} />
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
