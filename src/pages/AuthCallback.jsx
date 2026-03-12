import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useCart from '../hooks/useCart'


const AuthCallback = () => {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const {loginWithGoogle} = useAuth()
    const {fetchCart} = useCart()

    useEffect(()=>{
        const token = searchParams.get('token')
        const name = searchParams.get('name')
        const email = searchParams.get('email')
        const role = searchParams.get('role')
        const userId = searchParams.get('userId')

        if(token){
            loginWithGoogle({token, name, email, role, userId})
            fetchCart(userId)
            navigate('/')
        }else{
            navigate('/login')
        }
    }, [])
    return (
        <div style={{
            minHeight  : '100vh',
            display    : 'flex',
            flexDirection: 'column',
            alignItems : 'center',
            justifyContent: 'center',
            gap        : '16px'
        }}>
            <div className="spinner" />
            <p style={{ color: '#666' }}>
                Logging you in with Google...
            </p>
        </div>
    )
}

export default AuthCallback;