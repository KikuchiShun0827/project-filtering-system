import { cx } from '@emotion/css'
import type { MouseEventHandler, ReactNode } from 'react'

/** 見出し付きのカードセクション */
const SectionCard = ({
  label,
  children,
  className,
  onClick,
}: {
  label?: ReactNode
  children: ReactNode
  className?: string
  /** 指定するとカード全体がクリック可能になる */
  onClick?: MouseEventHandler<HTMLElement>
}) => (
  <section className={cx('card card-pad', className)} onClick={onClick}>
    {label && <div className="section-label">{label}</div>}
    {children}
  </section>
)

export default SectionCard
