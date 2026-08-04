import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Simple admin auth — replace credentials as needed
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'annalakshmi2024'

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true')

  const login = (user, pass) => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('isAdmin', 'true')
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('isAdmin')
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
