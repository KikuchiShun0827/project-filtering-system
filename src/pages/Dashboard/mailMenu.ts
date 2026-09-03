import type { CardMenuItem } from '../../components/CardMenu'
import { MAIL_LABEL, type Mail, type MailLabel } from '../../types'

/**
 * カード右上のメニュー項目。
 * 現在のラベル以外への振り替えと削除を並べる（案件・人材・その他で共通）。
 */
export const mailMenuItems = (
  mail: Mail,
  setLabel: (mailId: string, label: MailLabel) => void,
  deleteMail: (mailId: string) => void,
): CardMenuItem[] => [
  ...(Object.keys(MAIL_LABEL) as MailLabel[])
    .filter((l) => l !== mail.label)
    .map((l) => ({ label: `「${MAIL_LABEL[l]}」に分類`, onSelect: () => setLabel(mail.id, l) })),
  {
    label: '削除',
    danger: true,
    // 元に戻せないので確認を挟む
    onSelect: () => window.confirm(`「${mail.subject}」を削除します。よろしいですか？`) && deleteMail(mail.id),
  },
]
