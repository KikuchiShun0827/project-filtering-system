import { css } from '@emotion/css'
import { StatusBadge, waitingDays } from '../../components/ui'
import { WORK_STYLE_LABEL, type Engineer } from '../../types'

/** 氏名・ステータス・基本スペック。ステータスの変更は編集画面から行う */
const ProfileCard = ({ engineer }: { engineer: Engineer }) => {
  return (
    <>
      <div className={styles.head}>
        <div className="avatar" style={{ width: 52, height: 52, fontSize: 20 }}>
          {engineer.name[0]}
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 className={styles.name}>{engineer.name}</h2>
          <div className="muted small">
            {engineer.age}歳 / {engineer.gender} / {engineer.location}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <StatusBadge status={engineer.status} since={engineer.waitingSince} />
          <div className="muted small" style={{ marginTop: 4 }}>
            {engineer.status === 'assigned'
              ? engineer.currentProject
              : engineer.status === 'waiting' && engineer.waitingSince
                ? `待機開始 ${engineer.waitingSince}（${waitingDays(engineer.waitingSince)}日経過）`
                : engineer.currentProject ?? ''}
          </div>
        </div>
      </div>

      <div className="spec-block">
        <div className="section-label">概要</div>
        <p className="small muted" style={{ margin: 0 }}>
          {engineer.summary}
        </p>
      </div>

      <div className="spec-block">
        <div className="section-label">基本情報</div>
        <dl className="spec-grid">
          <div className="spec">
            <dt>所属会社</dt>
            <dd>{engineer.company}</dd>
          </div>
          <div className="spec">
            <dt>勤務可能エリア</dt>
            <dd>{engineer.workAreas.join('・')}</dd>
          </div>
          <div className="spec">
            <dt>稼働形態</dt>
            <dd>{WORK_STYLE_LABEL[engineer.workStyle]}</dd>
          </div>
          <div className="spec">
            <dt>希望単価</dt>
            <dd>{engineer.desiredRate} 万円〜</dd>
          </div>
          <div className="spec">
            <dt>稼働可能日</dt>
            <dd>{engineer.availableFrom}</dd>
          </div>
        </dl>
      </div>
    </>
  )
}

export default ProfileCard

const styles = {
  head: css`
    display: flex;
    gap: 16px;
    align-items: center;

    /* 氏名ブロックの下も、基本情報カードと同じ区切りにする */
    & + .spec-block {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }
  `,

  name: css`
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  `,
}
