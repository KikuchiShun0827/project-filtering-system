import { useState } from 'react'
import { Switch } from '../../components/ui'
import { useSettings } from '../../store/SettingsContext'

/** 連携するメールアカウントの一覧と追加フォーム */
const AccountSection = () => {
  const { settings, updateAccount, addAccount, removeAccount } = useSettings()
  const [newAddress, setNewAddress] = useState('')

  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>メールアドレス</th>
              <th>取り込み対象</th>
              <th>最終同期</th>
              <th>連携</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {settings.accounts.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.address}</td>
                <td>
                  <input
                    type="text"
                    value={a.targetLabel}
                    onChange={(e) => updateAccount(a.id, { targetLabel: e.target.value })}
                    style={{ width: 140, fontSize: 12, padding: '4px 8px' }}
                  />
                </td>
                <td className="muted">{a.lastSyncedAt}</td>
                <td>
                  <Switch
                    on={a.enabled}
                    label={`${a.address} の連携`}
                    onToggle={() => updateAccount(a.id, { enabled: !a.enabled })}
                  />
                </td>
                <td>
                  <button className="btn btn-sm" onClick={() => removeAccount(a.id)}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="toolbar" style={{ marginTop: 14, marginBottom: 0 }}>
        <input
          className="grow"
          type="email"
          placeholder="追加するメールアドレス"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <button
          className="btn"
          disabled={newAddress.trim() === ''}
          onClick={() => {
            addAccount(newAddress.trim())
            setNewAddress('')
          }}
        >
          アカウントを追加
        </button>
      </div>
      <p className="mock-note">モック版のため Gmail API とは接続していません。認証・同期は未実装です。</p>
    </>
  )
}

export default AccountSection
