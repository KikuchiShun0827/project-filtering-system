import { ImportanceSelector } from '../ui'
import { CONDITION_LABEL, type ConditionKey, type Importance, type ProfileCondition } from '../../types'

export const defaultConditions = (): ProfileCondition[] =>
  (Object.keys(CONDITION_LABEL) as ConditionKey[]).map((key) => ({ key, importance: 'any' as Importance }))

/** 就業希望条件ごとの重要度と補足 */
const ConditionFields = ({
  conditions,
  onChange,
}: {
  conditions: ProfileCondition[]
  onChange: (conditions: ProfileCondition[]) => void
}) => {
  const patch = (key: ConditionKey, values: Partial<ProfileCondition>) =>
    onChange(conditions.map((c) => (c.key === key ? { ...c, ...values } : c)))

  return (
    <>
      <p className="muted small" style={{ marginTop: 0 }}>
        項目ごとの重要度を「必須 / 尚可 / 不問」から選択します。マッチ率の重み付けに反映されます。
      </p>
      {conditions.map((c) => (
        <div key={c.key} className="cond-row">
          <span className="cond-name">{CONDITION_LABEL[c.key]}</span>
          <ImportanceSelector value={c.importance} onChange={(v) => patch(c.key, { importance: v })} />
          <input
            type="text"
            placeholder="補足（任意）"
            value={c.note ?? ''}
            onChange={(e) => patch(c.key, { note: e.target.value })}
          />
        </div>
      ))}
    </>
  )
}

export default ConditionFields
