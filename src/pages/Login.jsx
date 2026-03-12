import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaFire, FaGoogle } from 'react-icons/fa'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import useAuth from '../hooks/useAuth'
import useCart from '../hooks/useCart'
import '../styles/auth.css'


const Login = ()=>{

  const {login} = useAuth()
  const {fetchCart} = useCart()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
        setError('Email is required')
        return
    }
    if (!password.trim()) {
        setError('Password is required')
        return
    }

    try {
        setLoading(true)

        const result = await login(email, password)

        if (result.success) {
            const savedUser = JSON.parse(
                localStorage.getItem('user'))

            if (savedUser && savedUser.id) {
                await fetchCart(savedUser.id)
            }

            if (result.role === 'ADMIN') {
                navigate('/')
            } else {
                navigate('/')
            }

        } else {
            setError(result.error || 'Login failed')
        }

    } catch (err) {
        setError('Something went wrong. Try again')
        console.error(err)
    } finally {
        setLoading(false)
    }
}

  const handleGoogleLogin = ()=>{
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <FaFire className="auth-logo-icon"/>
          <span className="auth-logo-text">
            StrideFire
          </span>
        </div>

        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">
          Login to continue shopping
        </p>
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}
          className="auth-form">
            <div className="form-group">
              <label className="form-label">
                Email
              </label>
              <input type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <div className="password-wrapper">
                <input 
                  type={showPassword
                    ? "text"
                    : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
                <button type="button" className="eye-btn"
                  onClick={()=>setShowPassword(
                    !showPassword)}>
                  {showPassword
                    ? <FiEyeOff/>
                    : <FiEye/>}

                </button>
              </div>
            </div>
            <button
              type="submit"
              className="auth-btn"
              disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="btn-google"
          onClick={handleGoogleLogin}>
            <FaGoogle/>
            Continue with Google
        </button>
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">
            Register here
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login;