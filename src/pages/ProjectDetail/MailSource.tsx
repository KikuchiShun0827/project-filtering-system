import { css, cx } from '@emotion/css'
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

      <pre className={cx(styles.body, clampable && !expanded && 'clamped')}>{mail.body}</pre>

      {clampable && (
        <button className="btn btn-sm btn-block" style={{ marginTop: 12 }} onClick={() => setExpanded(!expanded)}>
          {expanded ? '折りたたむ' : '全文を表示'}
        </button>
      )}
    </>
  )
}

export default MailSource

const styles = {
  /* 元メールの原文。改行・空白をそのまま見せる */
  body: css`
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
    font-size: 12.5px;
    line-height: 1.85;
    color: var(--text);

    /* 折りたたみ時は下端をフェードさせて続きがあることを示す */
    &.clamped {
      max-height: 240px;
      overflow: hidden;
      -webkit-mask-image: linear-gradient(to bottom, #000 65%, transparent);
      mask-image: linear-gradient(to bottom, #000 65%, transparent);
    }
  `,
}
