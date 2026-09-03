import { Switch } from '../../components/ui'
import { useSettings, type ClassifierModel } from '../../store/SettingsContext'
import SettingRow from './SettingRow'

const MODEL_LABEL: Record<ClassifierModel, string> = {
  'gemini-2.5-flash': 'Gemini 2.5 Flash',
  'claude-haiku-4-5': 'Claude Haiku 4.5',
}

/** 分類に使う AI モデルと Gmail ラベル付与の設定 */
const ClassifierSection = () => {
  const { settings, update } = useSettings()

  return (
    <>
      <SettingRow
        title="分類に使用する AI モデル"
        description="受信メールを案件 / 人材 / その他に分類します（モックのため未接続）"
      >
        <select value={settings.classifier} onChange={(e) => update({ classifier: e.target.value as ClassifierModel })}>
          {(Object.keys(MODEL_LABEL) as ClassifierModel[]).map((m) => (
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
    </>
  )
}

export default ClassifierSection
