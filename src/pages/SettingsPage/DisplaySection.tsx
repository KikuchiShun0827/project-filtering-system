import { Switch } from '../../components/ui'
import { MAX_MATCH_RESULTS } from '../../lib/match'
import { MAX_DISPLAY_DAYS, useSettings } from '../../store/SettingsContext'
import SettingRow from './SettingRow'

/** 表示期間・マッチ率の表示件数・テーマ */
const DisplaySection = () => {
  const { settings, update } = useSettings()

  return (
    <>
      <SettingRow
        title="表示期間"
        description={`案件・人材一覧に表示するメールの期間。これより古いメールは一覧から隠れます（1〜${MAX_DISPLAY_DAYS}日）`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="number"
            min={1}
            max={MAX_DISPLAY_DAYS}
            value={settings.displayDays}
            onChange={(e) =>
              update({ displayDays: Math.min(MAX_DISPLAY_DAYS, Math.max(1, Number(e.target.value) || 1)) })
            }
            style={{ width: 84 }}
          />
          <span className="muted small">日前まで</span>
        </div>
      </SettingRow>

      <SettingRow
        title="マッチ率の表示件数"
        description={`案件・人材一覧のカードに表示するマッチ候補の件数（1〜${MAX_MATCH_RESULTS}件）`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="range"
            min={1}
            max={MAX_MATCH_RESULTS}
            value={settings.matchCount}
            onChange={(e) => update({ matchCount: Number(e.target.value) })}
          />
          <input
            type="number"
            min={1}
            max={MAX_MATCH_RESULTS}
            value={settings.matchCount}
            onChange={(e) =>
              update({ matchCount: Math.min(MAX_MATCH_RESULTS, Math.max(1, Number(e.target.value) || 1)) })
            }
            style={{ width: 68 }}
          />
          <span className="muted small">件</span>
        </div>
      </SettingRow>

      <SettingRow title="ダークモード" description="画面全体の配色を切り替えます">
        <Switch on={settings.darkMode} label="ダークモード" onToggle={() => update({ darkMode: !settings.darkMode })} />
      </SettingRow>
    </>
  )
}

export default DisplaySection
