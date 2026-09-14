import { css, cx } from '@emotion/css'

/** ON/OFF を切り替えるトグルスイッチ */
const Switch = ({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) => (
  <button type="button" className={cx(styles.switch, on && 'on')} aria-label={label} aria-pressed={on} onClick={onToggle} />
)

export default Switch

const styles = {
  switch: css`
    width: 44px;
    height: 24px;
    border-radius: 999px;
    border: 1px solid var(--border-strong);
    background: var(--surface-2);
    position: relative;
    padding: 0;
    flex-shrink: 0;

    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--border-strong);
      transition: transform 0.15s ease, background 0.15s ease;
    }

    &.on {
      background: var(--accent-soft);
      border-color: var(--accent);
    }

    &.on::after {
      transform: translateX(20px);
      background: var(--accent);
    }
  `,
}
