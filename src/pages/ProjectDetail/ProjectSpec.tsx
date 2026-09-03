import type { Project } from '../../types'
import { WORK_STYLE_LABEL } from '../../types'

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
        <dt>開始時期</dt>
        <dd>{project.startFrom}</dd>
      </div>
      <div className="spec">
        <dt>期間</dt>
        <dd>{project.period}</dd>
      </div>
    </dl>
  </>
)

export default ProjectSpec
