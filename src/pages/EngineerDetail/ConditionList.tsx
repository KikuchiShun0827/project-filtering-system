import { ImportanceSelector } from '../../components/ui'
import { useData } from '../../store/DataContext'
import { CONDITION_LABEL, type Engineer } from '../../types'

/** 就業希望条件ごとの重要度設定 */
const ConditionList = ({ engineer }: { engineer: Engineer }) => {
  const { updateConditionImportance } = useData()

  return (
    <>
      <p className="muted small" style={{ marginTop: 0 }}>
        項目ごとの重要度を「必須 / 尚可 / 不問」から選択します。マッチ率の重み付けに反映されます。
      </p>
      {engineer.conditions.map((c) => (
        <div key={c.key} className="cond-row">
          <span className="cond-name">{CONDITION_LABEL[c.key]}</span>
          <ImportanceSelector
            value={c.importance}
            onChange={(v) => updateConditionImportance(engineer.id, c.key, v)}
          />
          <span className="muted small">{c.note ?? ''}</span>
        </div>
      ))}
    </>
  )
}

export default ConditionList
