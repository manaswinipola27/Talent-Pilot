import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const saved = localStorage.getItem('vm_token')
        const savedUser = localStorage.getItem('vm_user')
        if (saved && savedUser) {
            setToken(saved)
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const login = (tokenStr, userData) => {
        setToken(tokenStr)
        setUser(userData)
        localStorage.setItem('vm_token', tokenStr)
        localStorage.setItem('vm_user', JSON.stringify(userData))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('vm_token')
        localStorage.removeItem('vm_user')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
