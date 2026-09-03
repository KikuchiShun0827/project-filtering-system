import { useState } from 'react'
import type { Mail } from '../../types'
import { formatDate } from '../Dashboard/format'

/** 長文は折りたたむ。この文字数を超えたら「全文を表示」を出す */
const CLAMP_LENGTH = 400

/** 抽出元メールの原文 */
const MailSource = ({ mail }: { mail: Mail }) => {
  const [expanded, setExpanded] = useState(false)
  const clampable = (mail.body?.length ?? 0) > CLAMP_LENGTH

  return (
    <>
      <div className="item-meta" style={{ marginBottom: 10 }}>
        <span>{mail.fromName}</span>
        <span>{mail.fromAddress}</span>
        <span>{formatDate(mail.receivedAt)}</span>
      </div>

      <pre className={`mail-body${clampable && !expanded ? ' clamped' : ''}`}>{mail.body}</pre>

      {clampable && (
        <button className="btn btn-sm btn-block" style={{ marginTop: 12 }} onClick={() => setExpanded(!expanded)}>
          {expanded ? '折りたたむ' : '全文を表示'}
        </button>
      )}
    </>
  )
}

export default MailSource
