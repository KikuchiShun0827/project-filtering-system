import CardMenu from '../../components/CardMenu'
import { Section } from '../../components/Page'
import { useData, type TalentItem } from '../../store/DataContext'
import { WORK_STYLE_LABEL } from '../../types'
import MailMeta from './MailMeta'
import { mailMenuItems } from './mailMenu'

const TalentCard = ({ item }: { item: TalentItem }) => {
  const { setLabel, deleteMail } = useData()
  const { mail, talent } = item

  const head = (
    <div className="item-head">
      <div style={{ minWidth: 0 }}>
        <h3 className="item-subject">{mail.subject}</h3>
        <MailMeta mail={mail} />
      </div>
      <CardMenu items={mailMenuItems(mail, setLabel, deleteMail)} />
    </div>
  )

  return (
    <Section>
      {head}

      {!talent ? (
        <p className="muted small" style={{ marginTop: 12 }}>
          このメールからは人材情報が抽出されていません。
        </p>
      ) : (
        <>
          <p className="small muted" style={{ margin: '10px 0 0' }}>
            {talent.summary}
          </p>
          <dl className="spec-grid">
            <div className="spec">
              <dt>氏名 / 所属</dt>
              <dd>{talent.name}</dd>
            </div>
            <div className="spec">
              <dt>年齢 / 居住地</dt>
              <dd>
                {talent.age}歳・{talent.location}
              </dd>
            </div>
            <div className="spec">
              <dt>希望単価 / 形態</dt>
              <dd>
                {talent.desiredRate}万〜・{WORK_STYLE_LABEL[talent.workStyle]}
              </dd>
            </div>
            <div className="spec">
              <dt>稼働可能日</dt>
              <dd>{talent.availableFrom}</dd>
            </div>
          </dl>

          <div className="section-label">保有スキル</div>
          <div className="chip-row">
            {talent.skills.map((s) => (
              <span key={s.name} className="badge badge-plain">
                {s.name} {s.years}年
              </span>
            ))}
          </div>
        </>
      )}
    </Section>
  )
}

export default TalentCard
