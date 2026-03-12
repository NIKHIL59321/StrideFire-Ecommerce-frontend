import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoute = ({ children }) => {

    const { isLoggedIn, loading } = useAuth()

    // Wait for session restore
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
            </div>
        )
    }

    // Redirect to login if not logged in
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute