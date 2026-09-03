import type { ReactNode } from 'react'

/** 「見出し＋説明」と操作 UI を左右に並べる設定項目 */
const SettingRow = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
  <div className="setting-row">
    <div>
      <div className="setting-title">{title}</div>
      <div className="muted small">{description}</div>
    </div>
    {children}
  </div>
)

export default SettingRow
