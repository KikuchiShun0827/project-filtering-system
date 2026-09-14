import { css } from '@emotion/css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { useData } from '../store/DataContext'
import { BriefcaseIcon, GearIcon, ListIcon, SendIcon, UsersIcon } from './icons'

const NAV = [
  { to: '/', label: '案件・人材一覧', Icon: ListIcon, end: true },
  { to: '/applications', label: '応募管理', Icon: SendIcon, end: false },
  { to: '/assignments', label: '参画案件一覧', Icon: BriefcaseIcon, end: false },
  { to: '/engineers', label: '要員管理', Icon: UsersIcon, end: false },
  { to: '/settings', label: '設定', Icon: GearIcon, end: false },
]

const Layout = () => {
  const { user, logout } = useAuth()
  const { unclassifiedCount, unreadReplyCount } = useData()
  const navigate = useNavigate()

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className="brand">
          <div className="brand-mark">PF</div>
          <div>
            <div className="brand-name">projects filtering</div>
            <div className="brand-sub">SES メール振り分け</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map((n) => (
            // className を文字列で渡すと、NavLink が現在のページで active クラスを付ける
            <NavLink key={n.to} to={n.to} end={n.end} className={styles.navLink}>
              <span className={styles.navIcon}>
                <n.Icon />
              </span>
              <span>{n.label}</span>
              {/* 未分類メールが残っていれば赤いマークで知らせる */}
              {n.to === '/' && unclassifiedCount > 0 && (
                <span className="tab-count alert">{unclassifiedCount}</span>
              )}
              {/* 応募への返信が未確認なら赤いマークで知らせる */}
              {n.to === '/applications' && unreadReplyCount > 0 && (
                <span className="tab-count alert">{unreadReplyCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userChip}>
            <div className="avatar">{user?.name?.[0]?.toUpperCase() ?? 'U'}</div>
            <div>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userMail}>{user?.email}</div>
            </div>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            ログアウト
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

const styles = {
  app: css`
    display: grid;
    grid-template-columns: 232px 1fr;
    min-height: 100vh;
  `,

  sidebar: css`
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: sticky;
    top: 0;
    height: 100vh;
  `,

  nav: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  navLink: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 9px;
    color: var(--text-muted);
    font-weight: 600;

    &:hover {
      background: var(--surface-2);
      color: var(--text);
    }

    &.active {
      background: var(--accent-soft);
      color: var(--accent);
    }

    /* 通知バッジはラベルの長さに関わらずサイドバー右端で縦に揃える */
    & .tab-count {
      margin-left: auto;
    }
  `,

  navIcon: css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 18px;
    height: 18px;
  `,

  sidebarFooter: css`
    margin-top: auto;
    border-top: 1px solid var(--border);
    padding-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  userChip: css`
    display: flex;
    align-items: center;
    gap: 10px;
  `,

  userName: css`
    font-weight: 700;
    font-size: 12px;
  `,

  userMail: css`
    font-size: 11px;
    color: var(--text-muted);
    word-break: break-all;
  `,

  main: css`
    padding: 24px 28px 56px;
    min-width: 0;
  `,
}
