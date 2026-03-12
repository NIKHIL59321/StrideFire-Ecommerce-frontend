import { createContext, useState } from 'react'
import {
    addToCart as addToCartService,
    getCart as getCartService,
    updateQuantity as updateQuantityService,
    removeItem as removeItemService,
    clearCart as clearCartService
} from '../services/cartService'

const CartContext = createContext()

export const CartProvider = ({children})=>{

    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [cartCount, setCartCount] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [error, setError] = useState(null)

    const fetchCart = async(userId)=>{
        try{
            setLoading(true)
            const data = await getCartService(userId)

            setCartItems(data.cartItems || [])
            setCartCount(data.totalItems || 0)
            setTotalPrice(data.total || 0)

        }catch(error){
            console.error('Fetch cart failed:',error)
            setError(error.error || 'Failed to fetch cart')
        }finally{
            setLoading(false)
        }
    }
    const addItem = async(userId, productId, quantity)=>{
        try{
            setLoading(true)
            const data = await addToCartService(userId, productId, quantity)
            await fetchCart(userId)
            return {success: true, message: data.message}
        }catch(error){
            return {success: false, error: error.error || 'Failed to add item to cart'}
        }finally{
            setLoading(false)
        }
    }
    const updateItem = async(userId, productId, quantity)=>{
        try{
            setLoading(true)
            const data = await updateQuantityService(userId, productId, quantity)
            await fetchCart(userId)
            return {success:true, message:data.message}
        }catch(error){
            return {success:false, error:error.error||'Failed to update cart item'}
        }finally{
            setLoading(false)
        }
    }
    const removeItem = async(cartItemId, userId)=>{
        try{
            setLoading(true)
            const data = await removeItemService(cartItemId)
            await fetchCart(userId)
            return {success:true, message:data.message}
        }catch(error){
            return {success:false, error:error.error||'Failed to remove cart item'}
        }finally{
            setLoading(false)
        }
    }
    const clearCart = async(userId)=>{
        try{
            setLoading(true)
            await clearCartService(userId)
            setCartItems([])
            setCartCount(0)
            setTotalPrice(0)
            return {success:true}
        }catch(error){  
            return {success:false, error:error.error||'Failed to clear cart'}
        }finally{
            setLoading(false)
        }
    }

    return(
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            totalPrice,
            loading,
            error,
            fetchCart,
            addItem,
            updateItem,
            removeItem,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext;