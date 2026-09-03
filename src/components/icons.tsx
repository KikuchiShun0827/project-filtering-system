import type { SVGProps } from 'react'

/**
 * サイドバー等で使う単色ラインアイコン。
 * 色は stroke="currentColor" で親から継承するので、リンクの状態に追従する。
 */
const Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={18}
    height={18}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  />
)

/** 一覧 */
export const ListIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <circle cx="5.2" cy="7" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="5.2" cy="12" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="5.2" cy="17" r="1.3" fill="currentColor" stroke="none" />
    <line x1="9.5" y1="7" x2="20" y2="7" />
    <line x1="9.5" y1="12" x2="20" y2="12" />
    <line x1="9.5" y1="17" x2="20" y2="17" />
  </Icon>
)

/** 要員 */
export const UsersIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <circle cx="9.5" cy="8.5" r="3.3" />
    <path d="M3.5 19.5a6 6 0 0 1 12 0" />
    <circle cx="17.8" cy="9.8" r="2.3" />
    <path d="M16.2 14.4a5 5 0 0 1 4.3 5.1" />
  </Icon>
)

/** ハンバーガーメニュー */
export const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </Icon>
)

/** 設定 */
export const GearIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="5.4" />
    <circle cx="12" cy="12" r="2.2" />
    <line x1="17.4" y1="12" x2="20.6" y2="12" />
    <line x1="15.82" y1="15.82" x2="18.08" y2="18.08" />
    <line x1="12" y1="17.4" x2="12" y2="20.6" />
    <line x1="8.18" y1="15.82" x2="5.92" y2="18.08" />
    <line x1="6.6" y1="12" x2="3.4" y2="12" />
    <line x1="8.18" y1="8.18" x2="5.92" y2="5.92" />
    <line x1="12" y1="6.6" x2="12" y2="3.4" />
    <line x1="15.82" y1="8.18" x2="18.08" y2="5.92" />
  </Icon>
)

/** 参画案件 */
export const BriefcaseIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <rect x="3" y="7.5" width="18" height="12" rx="2.2" />
    <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
    <line x1="3" y1="12.5" x2="21" y2="12.5" />
  </Icon>
)
