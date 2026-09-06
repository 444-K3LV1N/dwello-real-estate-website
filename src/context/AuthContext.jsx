import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('dwello_token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) return
    api.me(token).then((data) => setUser(data.user)).catch(() => { localStorage.removeItem('dwello_token'); setToken(null) }).finally(() => setLoading(false))
  }, [token])

  const login = async (credentials) => { const data = await api.login(credentials); localStorage.setItem('dwello_token', data.token); setToken(data.token); setUser(data.user); return data.user }
const register = async (details) => { const data = await api.register(details); localStorage.setItem('dwello_token', data.token); setToken(data.token); setUser(data.user); return data.user }
  const logout = () => { localStorage.removeItem('dwello_token'); setToken(null); setUser(null) }
  const value = { token, user, loading, login, register, logout, isAuthenticated: Boolean(user), isStaff: user?.role === 'AGENT' || user?.role === 'ADMIN' }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
