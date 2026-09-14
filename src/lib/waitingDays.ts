/** 待機開始日から今日までの日数 */
export const waitingDays = (since: string) =>
  Math.max(0, Math.round((Date.now() - new Date(since).getTime()) / 86_400_000))
