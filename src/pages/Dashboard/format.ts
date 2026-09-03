/** 2026-01-05T09:30 → 01-05 09:30 */
export const formatDate = (iso: string) => iso.replace('T', ' ').slice(5, 16)
