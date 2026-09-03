import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { useData } from '../store/DataContext'
import { BriefcaseIcon, GearIcon, ListIcon, UsersIcon } from './icons'

const NAV = [
  { to: '/', label: '案件・人材一覧', Icon: ListIcon, end: true },
  { to: '/assignments', label: '参画案件一覧', Icon: BriefcaseIcon, end: false },
  { to: '/engineers', label: '要員管理', Icon: UsersIcon, end: false },
  { to: '/settings', label: '設定', Icon: GearIcon, end: false },
]

const Layout = () => {
  const { user, logout } = useAuth()
  const { unclassifiedCount } = useData()
  const navigate = useNavigate()

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">PF</div>
          <div>
            <div className="brand-name">projects filtering</div>
            <div className="brand-sub">SES メール振り分け</div>
          </div>
        </div>

        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon">
                <n.Icon />
              </span>
              <span>{n.label}</span>
              {n.to === '/' && unclassifiedCount > 0 && <span className="tab-count">{unclassifiedCount}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{user?.name?.[0]?.toUpperCase() ?? 'U'}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12 }}>{user?.name}</div>
              <div className="user-mail">{user?.email}</div>
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

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
