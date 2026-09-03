import { GMAIL_LABEL, type Mail } from '../../types'
import { formatDate } from './format'

/** 送信元・受信日時・ラベル・AI 確信度の一行表示 */
const MailMeta = ({ mail }: { mail: Mail }) => (
  <div className="item-meta">
    <span>{mail.fromName}</span>
    <span>{formatDate(mail.receivedAt)}</span>
    <span className="badge badge-plain">{GMAIL_LABEL[mail.label ?? 'other']}</span>
    {mail.manualOverride ? (
      <span className="badge badge-plain">手動変更</span>
    ) : (
      mail.confidence !== undefined && <span>AI確信度 {Math.round(mail.confidence * 100)}%</span>
    )}
  </div>
)

export default MailMeta
