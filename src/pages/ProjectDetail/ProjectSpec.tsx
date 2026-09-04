import type { Project } from '../../types'
import { CONTRACT_TIER_LABEL, FOREIGNER_POLICY_LABEL, WORK_STYLE_LABEL } from '../../types'

/** 案件の概要と基本スペック */
const ProjectSpec = ({ project }: { project: Project }) => (
  <>
    <p className="small muted" style={{ marginTop: 0 }}>
      {project.summary}
    </p>
    <dl className="spec-grid">
      <div className="spec">
        <dt>勤務地</dt>
        <dd>{project.location}</dd>
      </div>
      <div className="spec">
        <dt>最寄り駅</dt>
        <dd>{project.nearestStation}</dd>
      </div>
      <div className="spec">
        <dt>稼働形態</dt>
        <dd>{WORK_STYLE_LABEL[project.workStyle]}</dd>
      </div>
      <div className="spec">
        <dt>単価</dt>
        <dd>
          {project.rateMin}〜{project.rateMax} 万円
        </dd>
      </div>
      <div className="spec">
        <dt>精算幅</dt>
        <dd>
          {project.settlementMin}〜{project.settlementMax} h
        </dd>
      </div>
      <div className="spec">
        <dt>開始時期</dt>
        <dd>{project.startFrom}</dd>
      </div>
      <div className="spec">
        <dt>期間</dt>
        <dd>{project.period}</dd>
      </div>
      <div className="spec">
        <dt>勤務時間</dt>
        <dd>{project.workHours}</dd>
      </div>
      <div className="spec">
        <dt>募集人数</dt>
        <dd>{project.headcount} 名</dd>
      </div>
      <div className="spec">
        <dt>面談回数</dt>
        <dd>{project.interviewCount} 回</dd>
      </div>
      <div className="spec">
        <dt>商流</dt>
        <dd>{CONTRACT_TIER_LABEL[project.contractTier]}</dd>
      </div>
      <div className="spec">
        <dt>年齢制限</dt>
        <dd>{project.ageLimit ? `〜${project.ageLimit} 歳` : '不問'}</dd>
      </div>
      <div className="spec">
        <dt>外国籍</dt>
        <dd>{FOREIGNER_POLICY_LABEL[project.foreignerPolicy]}</dd>
      </div>
    </dl>
  </>
)

export default ProjectSpec
