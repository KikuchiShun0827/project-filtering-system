import type { ProjectItem } from '../../store/DataContext'

export type ProjectSortKey = 'received' | 'rate' | 'start'

export const PROJECT_SORT_LABEL: Record<ProjectSortKey, string> = {
  received: '新着順',
  rate: '単価順',
  start: '開始日順',
}

/**
 * 案件カードの並び順。
 * 新着（受信日時）と単価は新しい／高い順、開始日は早い順。
 * 案件情報が抽出できていないメールは比較値を持たないので末尾へ送る。
 */
export const PROJECT_SORT: Record<ProjectSortKey, (a: ProjectItem, b: ProjectItem) => number> = {
  received: (a, b) => b.mail.receivedAt.localeCompare(a.mail.receivedAt),
  rate: (a, b) => (b.project?.rateMax ?? -1) - (a.project?.rateMax ?? -1),
  start: (a, b) => (a.project?.startFrom ?? '9999-12-31').localeCompare(b.project?.startFrom ?? '9999-12-31'),
}
