import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiEye } from 'react-icons/fi'
import useAuth from '../hooks/useAuth'
import useCart from '../hooks/useCart'

const ProductCard = ({ product }) => {

    const navigate             = useNavigate()
    const { isLoggedIn, user } = useAuth()
    const { addItem }          = useCart()

    // ─────────────────────────────────────────
    // HANDLE ADD TO CART
    // ─────────────────────────────────────────
    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isLoggedIn) {
            navigate('/login')
            return
        }

        try {
            await addItem(user.id, product.id, 1)
        } catch (error) {
            console.log('Error adding to cart:', error)
        }
    }

    // ─────────────────────────────────────────
    // HANDLE VIEW PRODUCT
    // ─────────────────────────────────────────
    const handleView = (e) => {
        e.stopPropagation()
        navigate(`/product/${product.id}`)
    }

    return (
        <div className="product-card">

            {/* ── IMAGE ── */}
            {/* ✅ div instead of Link wrapper */}
            <div
                className="product-image-wrapper"
                onClick={handleView}
                style={{ cursor: 'pointer' }}>

                <img
                    src={product.imageUrl ||
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                    alt={product.name}
                    className="product-image"
                />

                {/* Overlay buttons */}
                <div className="product-overlay">

                    {/* ✅ button instead of Link */}
                    <button
                        className="overlay-btn"
                        onClick={handleAddToCart}
                        disabled={product.stocks === 0}
                        title="Add to cart">
                        <FiShoppingCart />
                    </button>

                    {/* ✅ button instead of Link */}
                    <button
                        className="overlay-btn"
                        onClick={handleView}
                        title="View product">
                        <FiEye />
                    </button>

                </div>

                {/* Out of stock badge */}
                {product.stocks === 0 && (
                    <span className="out-of-stock-badge">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* ── INFO ── */}
            <div className="product-info">
                <span className="product-brand">
                    {product.brand}
                </span>

                {/* ✅ Single Link here only */}
                <Link to={`/product/${product.id}`}>
                    <h3 className="product-name">
                        {product.name}
                    </h3>
                </Link>

                <div className="product-meta">
                    <span className="product-category">
                        {product.category}
                    </span>
                    <span className="product-size">
                        Size: {product.size}
                    </span>
                </div>

                <div className="product-footer">
                    <span className="product-price">
                        ₹{product.price.toLocaleString()}
                    </span>
                    <span className={`stock-status
                       ${product.stocks > 0
                            ? 'in-stock'
                            : 'out-stock'}`}>
                        {product.stocks > 0
                            ? `${product.stocks} left`
                            : 'Out of Stock'}
                    </span>
                </div>
            </div>

        </div>
    )
}

export default ProductCard;

