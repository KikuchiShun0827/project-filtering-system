import { IMPORTANCE_LABEL, type Importance } from '../types'

/** 必須／希望／不問を切り替えるボタン */
const ImportanceSelector = ({
  value,
  onChange,
}: {
  value: Importance
  onChange: (v: Importance) => void
}) => (
  <span className="seg">
    {(['must', 'want', 'any'] as const).map((v) => (
      <button key={v} type="button" className={value === v ? 'on' : ''} onClick={() => onChange(v)}>
        {IMPORTANCE_LABEL[v]}
      </button>
    ))}
  </span>
)

export default ImportanceSelector
