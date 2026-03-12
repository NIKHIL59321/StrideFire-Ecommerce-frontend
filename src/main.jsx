// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import App from './App'
import './index.css'

const stripePromise = loadStripe('pk_test_51T3tZqQwJLfgrB8YyrFhsU5WQZEByZIYDdm17dDB4NC6O7uxqE9w6IzMqKc0vQitvpbZb2AenLseJfO3IwXWu9LY00E4Vivv8K')

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider
            clientId="676906381463-3t45l31aqhvnqr5e551d0uq63p6tscq2.apps.googleusercontent.com">
            <AuthProvider>        
                <CartProvider>      
                    <Elements
                        stripe={stripePromise}>
                        <App /> 
                    </Elements>
                </CartProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </StrictMode>
)