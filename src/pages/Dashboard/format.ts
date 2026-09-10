/** 2026-01-05T09:30 → 01-05 09:30 */
export const formatDate = (iso: string) => iso.replace('T', ' ').slice(5, 16)

/** 2026-01-05T09:30:00 → 2026/01/05 09:30（詳細画面用の年込み表記） */
export const formatDateTime = (iso: string) => iso.slice(0, 16).replace('T', ' ').replace(/-/g, '/')
