import { useState } from 'react'
import Modal from '../../components/Modal'
import { useData } from '../../store/DataContext'
import { useSettings } from '../../store/SettingsContext'

const PRESETS = [1, 3, 7, 14, 30]
/** 読み込み期間の既定値と上限 */
const DEFAULT_DAYS = 7
const MAX_DAYS = 365

/** 「メールを読み込む」から開く、読み込み期間の指定モーダル */
const SyncModal = ({ onClose }: { onClose: () => void }) => {
  const { classify, countUnclassifiedWithin } = useData()
  const { settings } = useSettings()
  const [days, setDays] = useState(DEFAULT_DAYS)
  const [running, setRunning] = useState(false)

  const target = countUnclassifiedWithin(days)

  const run = async () => {
    setRunning(true)
    await classify(days)
    onClose()
  }

  return (
    <Modal title="メールの読み込み" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run()
        }}
      >
        <div className="field">
          <label htmlFor="sync-days">読み込み期間</label>
          {/* .field は縦並びなので、セグメントは内容ぶんの幅で左寄せにする */}
          <span className="seg" style={{ alignSelf: 'flex-start' }}>
            {PRESETS.map((d) => (
              <button key={d} type="button" className={days === d ? 'on' : ''} onClick={() => setDays(d)}>
                {d}日
              </button>
            ))}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <input
              id="sync-days"
              type="number"
              min={1}
              max={MAX_DAYS}
              value={days}
              onChange={(e) => setDays(Math.min(MAX_DAYS, Math.max(1, Number(e.target.value) || 1)))}
              style={{ width: 84 }}
            />
            <span className="muted small">日前まで遡って読み込みます</span>
          </div>
        </div>

        <div className="field">
          <label>読み込み対象</label>
          <div className="modal-readonly">
            <div style={{ fontWeight: 700 }}>未分類メール {target} 件</div>
            <div className="muted small">
              {settings.accounts.filter((a) => a.enabled).length} アカウント／
              {settings.autoLabel ? '分類後に Gmail ラベルを付与します' : 'Gmail ラベルの付与は無効です'}
            </div>
          </div>
        </div>

        <div className="form-actions">
          {target === 0 && <span className="muted small" style={{ marginRight: 'auto' }}>この期間に未分類メールはありません。</span>}
          <button type="button" className="btn" onClick={onClose} disabled={running}>
            キャンセル
          </button>
          <button type="submit" className="btn btn-primary" disabled={running || target === 0}>
            {running ? '読み込み中…' : '読み込む'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default SyncModal
