import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  // Revalidate token on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { setLoading(false); return }
    getMe()
      .then(r => { setUser(r.data); localStorage.setItem('user', JSON.stringify(r.data)) })
      .catch(() => { localStorage.clear(); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  const loginSave = ({ access_token, refresh_token, user: u }) => {
    localStorage.setItem('access_token',  access_token)
    localStorage.setItem('refresh_token', refresh_token)
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginSave, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
