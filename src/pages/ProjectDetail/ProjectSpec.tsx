import type { Mail, Project } from '../../types'
import { CONTRACT_TIER_LABEL, FOREIGNER_POLICY_LABEL, WORK_STYLE_LABEL } from '../../types'
import { formatDateTime } from '../Dashboard/format'

/** 抽出元メールの送信元情報・案件概要・基本スペックを 1 枚のカードにまとめる */
const ProjectSpec = ({ project, mail }: { project: Project; mail?: Mail }) => (
  <>
    {mail && (
      <div className="spec-block">
        <dl className="spec-grid">
          <div className="spec" style={{ gridColumn: '1 / -1' }}>
            <dt>メール件名</dt>
            <dd>{mail.subject}</dd>
          </div>
          <div className="spec">
            <dt>送信元会社</dt>
            <dd>{mail.fromCompany}</dd>
          </div>
          <div className="spec">
            <dt>担当者</dt>
            <dd>{mail.fromPerson ?? '記載なし'}</dd>
          </div>
          <div className="spec">
            <dt>受信日時</dt>
            <dd>{formatDateTime(mail.receivedAt)}</dd>
          </div>
        </dl>
      </div>
    )}

    <div className="spec-block">
      <div className="section-label">概要</div>
      <p className="small muted" style={{ margin: 0 }}>
        {project.summary}
      </p>
    </div>

    <div className="spec-block">
      <div className="section-label">案件情報</div>
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
        <div className="spec">
          <dt>実務未経験</dt>
          <dd>{project.inexperiencedOk ? 'OK' : 'NG'}</dd>
        </div>
      </dl>
    </div>
  </>
)

export default ProjectSpec
