import { useState, useEffect } from 'react'

export interface User {
  name: string
  email: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === '1234') {
      const newUser = { name: 'admin', email: '' }
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      setUser(newUser)
      return true
    } else if (username === 'user' && password === '1234') {
      const newUser = { name: 'user', email: '' }
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      setUser(newUser)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  const isAuthenticated = !!user

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
}
