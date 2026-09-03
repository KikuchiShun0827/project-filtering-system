import CardMenu from '../../components/CardMenu'
import { Section } from '../../components/Page'
import { useData } from '../../store/DataContext'
import type { Mail } from '../../types'
import MailMeta from './MailMeta'
import { mailMenuItems } from './mailMenu'

/** 「その他」タブのカード。案件・人材から抽出できる情報がないのでメール本体だけを見せる */
const OtherCard = ({ mail }: { mail: Mail }) => {
  const { setLabel, deleteMail } = useData()

  return (
    <Section>
      <div className="item-head">
        <div style={{ minWidth: 0 }}>
          <h3 className="item-subject">{mail.subject}</h3>
          <MailMeta mail={mail} />
        </div>
        <CardMenu items={mailMenuItems(mail, setLabel, deleteMail)} />
      </div>

      <p className="small muted" style={{ margin: '10px 0 0' }}>
        {mail.excerpt}
      </p>
    </Section>
  )
}

export default OtherCard
