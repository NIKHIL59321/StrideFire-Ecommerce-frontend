import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiArrowRight, FiTrash2 } from "react-icons/fi";
import CartItem from "../components/CartItem";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import "../styles/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { cartItems, cartCount, totalPrice, loading, fetchCart, clearCart } =
    useCart();

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchCart(user.id);
    } else {
      navigate("/login");
    }
  }, [isLoggedIn]);


  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear cart?")) {
      await clearCart(user.id);
    }
  };

  
  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

 
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FiShoppingCart className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet</p>
            <Link to="/shop" className="btn-primary">
              Start Shopping
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = totalPrice > 2000 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        {/* ── CART HEADER ── */}
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-items-count">{cartCount} items</span>
        </div>

        {/* ── CART BODY ── */}
        <div className="cart-body">
          {/* ── CART ITEMS ── */}
          <div className="cart-items-section">
            {/* Items Header */}
            <div className="cart-items-header">
              <span>Product</span>
              <span className="header-qty">Quantity</span>
              <span className="header-total">Subtotal</span>
              <span />
            </div>

            {/* Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Cart Footer */}
            <div className="cart-items-footer">
              <Link to="/shop" className="continue-shopping">
                ← Continue Shopping
              </Link>
              <button className="clear-cart-btn" onClick={handleClearCart}>
                <FiTrash2 />
                Clear Cart
              </button>
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free-shipping" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <div className="shipping-note">
                  Add ₹{(2000 - totalPrice).toLocaleString()} more for free
                  shipping
                </div>
              )}
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
              <FiArrowRight />
            </button>

            {/* Payment Icons */}
            <div className="payment-methods">
              <span className="payment-label">We accept:</span>
              <div className="payment-icons">
                <span className="payment-icon">💳 Card</span>
                <span className="payment-icon">📱 UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
