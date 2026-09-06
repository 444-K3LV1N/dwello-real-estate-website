import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import siteConfig from '../config/siteConfig'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const submit = async (event) => { event.preventDefault(); setError(''); try { const user = await login(form); navigate(user.role === 'USER' ? '/' : '/dashboard') } catch (requestError) { setError(requestError.message) } }
return (
  <main className="auth-page">
    <div className="auth-card">
      <Link className="brand" to="/">
        <span className="brand-mark">{siteConfig.logo}</span>
        <span>{siteConfig.name}</span>
      </Link>

      <p className="eyebrow">Welcome back</p>
      <h1>Sign in to your account.</h1>

      <form onSubmit={submit}>
        {error && <p className="form-error">{error}</p>}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            required
          />
        </label>

        <button className="button button-dark" type="submit">
          Sign in
        </button>
      </form>

      <p className="auth-help">
        Don't have an account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  </main>
)
}
