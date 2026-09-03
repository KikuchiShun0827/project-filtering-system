import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

const Login = () => {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('sales@example.co.jp')
  const [password, setPassword] = useState('password')

  if (user) return <Navigate to="/" replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // モック：入力値の検証は行わない
    login(email.trim() || 'guest@example.co.jp')
    navigate('/')
  }

  return (
    <div className="login">
      <form className="card login-card" onSubmit={submit}>
        <div className="brand">
          <div className="brand-mark">PF</div>
          <div>
            <div className="brand-name">projects filtering system</div>
            <div className="brand-sub">SES メール振り分け</div>
          </div>
        </div>

        <h1>ログイン</h1>
        <p className="page-desc" style={{ marginBottom: 18 }}>
          社内アカウントでログインしてください。
        </p>

        <div className="field">
          <label htmlFor="email">メールアドレス</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">パスワード</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 6 }}>
          ログイン
        </button>

        <p className="mock-note">
          モック版のため認証は行っていません。任意の値でログインできます。
        </p>
      </form>
    </div>
  )
}

export default Login
