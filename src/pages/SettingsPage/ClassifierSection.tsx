import { useState } from 'react'
import Switch from '../../components/Switch'
import { CLASSIFIER_MODELS, useSettings, type ClassifierModel } from '../../store/SettingsContext'
import OpenAIConnectModal from './OpenAIConnectModal'
import SettingRow from './SettingRow'

const MODEL_LABEL: Record<ClassifierModel, string> = {
  'gpt-5-mini': 'GPT-5 mini（推奨）',
  'gpt-5-nano': 'GPT-5 nano（低コスト）',
}

/** 分類に使う AI モデルと Gmail ラベル付与の設定 */
const ClassifierSection = () => {
  const { settings, update, disconnectOpenAI } = useSettings()
  const [connectOpen, setConnectOpen] = useState(false)
  const { connected, maskedKey, connectedAt } = settings.openai

  return (
    <>
      <SettingRow
        title="OpenAI 連携"
        description={
          connected
            ? `${maskedKey}（${connectedAt} に接続）`
            : 'API キーを登録すると、受信メールを案件 / 人材 / その他に分類します'
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={`badge ${connected ? 'badge-high' : 'badge-plain'}`}>{connected ? '接続済' : '未接続'}</span>
          {connected ? (
            <button className="btn btn-sm" onClick={disconnectOpenAI}>
              解除
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setConnectOpen(true)}>
              接続する
            </button>
          )}
        </div>
      </SettingRow>

      <SettingRow
        title="分類に使用する AI モデル"
        description="nano は低コスト、mini は本文からの情報抽出が正確です（モックのため未接続）"
      >
        <select
          value={settings.classifier}
          disabled={!connected}
          onChange={(e) => update({ classifier: e.target.value as ClassifierModel })}
        >
          {CLASSIFIER_MODELS.map((m) => (
            <option key={m} value={m}>
              {MODEL_LABEL[m]}
            </option>
          ))}
        </select>
      </SettingRow>

      <SettingRow
        title="Gmail へのラベル自動付与"
        description="分類結果を Gmail のラベルに反映し、ラベル済みのメールは次回の読み込み対象から除外します"
      >
        <Switch
          on={settings.autoLabel}
          label="ラベル自動付与"
          onToggle={() => update({ autoLabel: !settings.autoLabel })}
        />
      </SettingRow>

      {connectOpen && <OpenAIConnectModal onClose={() => setConnectOpen(false)} />}
    </>
  )
}

export default ClassifierSection
