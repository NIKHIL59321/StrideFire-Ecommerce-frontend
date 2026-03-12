import { createContext, useState, useEffect} from 'react'
import { login as loginService, register as registerService }
    from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser]           = useState(null)
    const [token, setToken]         = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading]     = useState(true)

 
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem('token')
            const savedUser  = localStorage.getItem('user')

            if (savedToken && savedUser) {
                setToken(savedToken)
                setUser(JSON.parse(savedUser))
                setIsLoggedIn(true)
            }
        } catch (error) {
            console.log('Session restore failed:', error)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        } finally {
            setLoading(false)
        }
    }, [])

    const register = async (userData) => {
        try {
            const data = await registerService(userData)
            return { success: true, message: data.message }
        } catch (error) {
            return { success: false, error: error.error
                || 'Registration failed' }
        }
    }

    const login = async (email, password) => {
        try {
            const data = await loginService(email, password)

            localStorage.setItem('token', data.token)

            const userData = {
                id : data.id,
                name : data.name,
                email : data.email,
                role : data.role
            }
            localStorage.setItem('user', JSON.stringify(userData))

            setToken(data.token)
            setUser(userData)
            setIsLoggedIn(true)

            return { success: true, role: data.role }

        } catch (error) {
            return { success: false, error: error.error
                || 'Login failed' }
        }
    }

    const logout = () => {
       
        localStorage.removeItem('token')
        localStorage.removeItem('user')

      
        setToken(null)
        setUser(null)
        setIsLoggedIn(false)
    }

    const isAdmin = () => {
        return user?.role === 'ADMIN'
    }

    const loginWithGoogle = async ({token, name, email, role, userId}) => {
        const userData = { id:userId, name, email, role }
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setToken(token)
        setUser(userData)
        setIsLoggedIn(true)
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoggedIn,
            loading,
            register,
            login,
            logout,
            isAdmin,
            loginWithGoogle
        }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
export default AuthContext
