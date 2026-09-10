import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ApplicationModal from '../../components/ApplicationModal'
import MatchCandidates from '../../components/MatchCandidates'
import { DetailHeader, EmptyState, Section } from '../../components/Page'
import { MAX_MATCH_RESULTS, rankProjects } from '../../lib/match'
import { useData } from '../../store/DataContext'
import { WORK_STYLE_LABEL, type Project } from '../../types'
import AssignedProjects from './AssignedProjects'
import ConditionList from './ConditionList'
import ProfileCard from './ProfileCard'
import SkillList from './SkillList'

const EngineerDetail = () => {
  const { engineerId } = useParams()
  const navigate = useNavigate()
  const { engineers, activeProjects, assignments, mails, addApplications } = useData()
  /** 応募モーダルを開いている案件 */
  const [applyProject, setApplyProject] = useState<Project | null>(null)

  /** 案件メールの送信元会社（メールが消えていれば案件のクライアント名） */
  const companyOf = (project: Project) =>
    mails.find((m) => m.id === project.mailId)?.fromCompany ?? project.client

  const engineer = engineers.find((e) => e.id === engineerId)

  // この要員が参画している案件（開始日の昇順）
  const assigned = assignments
    .filter((a) => a.members.some((m) => m.engineerId === engineerId))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))

  const candidates = useMemo(
    () =>
      (engineer ? rankProjects(engineer, activeProjects, MAX_MATCH_RESULTS) : []).map((r) => ({
        id: r.project.id,
        name: r.project.title,
        subtitle: (
          <div className="muted small">
            {r.project.client} / {r.project.location}・{WORK_STYLE_LABEL[r.project.workStyle]} / {r.project.rateMin}〜
            {r.project.rateMax}万
          </div>
        ),
        match: r.match,
        to: `/projects/${r.project.id}`,
        action: (
          <button className="btn btn-sm btn-primary" onClick={() => setApplyProject(r.project)}>
            応募
          </button>
        ),
      })),
    [engineer, activeProjects],
  )

  if (!engineer) {
    return (
      <EmptyState>
        要員が見つかりません。<Link to="/engineers">要員管理へ戻る</Link>
      </EmptyState>
    )
  }

  return (
    <>
      <DetailHeader
        title="要員詳細"
        actions={
          <Link className="btn btn-primary" to={`/engineers/${engineer.id}/edit`}>
            編集
          </Link>
        }
      />

      {applyProject && (
        <ApplicationModal
          project={applyProject}
          company={companyOf(applyProject)}
          initialMemberIds={[engineer.id]}
          onClose={() => setApplyProject(null)}
          onSubmit={(draft) => {
            addApplications({
              projectId: applyProject.id,
              projectTitle: applyProject.title,
              company: companyOf(applyProject),
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
            <Section label="参画案件">
              <AssignedProjects assignments={assigned} engineerId={engineer.id} />
            </Section>
          )}

          <Section>
            <ProfileCard engineer={engineer} />
          </Section>

          <Section label="所持技術・資格">
            <SkillList engineer={engineer} />
          </Section>

          <Section label="就業希望条件の重要度">
            <ConditionList engineer={engineer} />
          </Section>
        </div>

        <Section label="マッチ率の高い案件">
          <MatchCandidates candidates={candidates} empty="分類済みの案件がありません。" />
        </Section>
      </div>
    </>
  )
}

export default EngineerDetail
