import type { Project } from '../../types'

export type ProjectFilterKey = 'all' | 'inexperienced' | 'remote' | 'foreigner' | 'noAgeLimit'

export const PROJECT_FILTER_LABEL: Record<ProjectFilterKey, string> = {
  all: 'フィルターなし',
  inexperienced: '実務未経験OK',
  remote: 'フルリモート可',
  foreigner: '外国籍可',
  noAgeLimit: '年齢制限なし',
}

/** 案件カードの絞り込み条件。案件情報が抽出できていないメールは all 以外では出さない */
export const PROJECT_FILTER: Record<ProjectFilterKey, (project: Project) => boolean> = {
  all: () => true,
  inexperienced: (p) => p.inexperiencedOk,
  remote: (p) => p.workStyle !== 'onsite',
  foreigner: (p) => p.foreignerPolicy !== 'denied',
  noAgeLimit: (p) => p.ageLimit === undefined,
}
