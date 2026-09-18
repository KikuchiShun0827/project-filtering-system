import { useState } from 'react'
import Modal from '../../components/Modal'
import { useSettings } from '../../store/SettingsContext'

/** API キーとして受け付ける最低限の形式 */
const KEY_PREFIX = 'sk-'
const MIN_KEY_LENGTH = 20

/** 「接続する」から開く、OpenAI の API キー登録モーダル */
const OpenAIConnectModal = ({ onClose }: { onClose: () => void }) => {
  const { connectOpenAI } = useSettings()
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    const key = apiKey.trim()
    // モックのため通信は行わず、形式だけを確認する
    if (!key.startsWith(KEY_PREFIX) || key.length < MIN_KEY_LENGTH) {
      setError(`${KEY_PREFIX} で始まる ${MIN_KEY_LENGTH} 文字以上のキーを入力してください。`)
      return
    }
    connectOpenAI(key)
    onClose()
  }

  return (
    <Modal title="OpenAI と連携" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <div className="field">
          <label htmlFor="openai-key">API キー</label>
          <input
            id="openai-key"
            type="password"
            autoComplete="off"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value)
              setError('')
            }}
          />
          <span className="muted small">
            OpenAI のダッシュボードで発行したキーを貼り付けてください。
          </span>
        </div>

        <div className="form-actions">
          {error && (
            <span className="muted small" style={{ marginRight: 'auto' }}>
              {error}
            </span>
          )}
          <button type="button" className="btn" onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" className="btn btn-primary" disabled={apiKey.trim() === ''}>
            接続する
          </button>
        </div>
      </form>

      <p className="mock-note">
        モック版のため OpenAI API とは接続していません。入力されたキーは保存されず、画面表示用にマスクした文字列だけが残ります。
      </p>
    </Modal>
  )
}

export default OpenAIConnectModal
