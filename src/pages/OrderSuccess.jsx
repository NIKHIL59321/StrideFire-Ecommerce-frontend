import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";
import "../styles/ordersuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;

  // Redirect if no order data
  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [navigate, order]);

  if (!order) return null;

  return (
    <div className="success-page">
      <div className="success-card">
        {/* ── ICON ── */}
        <div className="success-icon-wrapper">
          <FiCheckCircle className="success-icon" />
        </div>

        {/* ── HEADING ── */}
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-subtitle">
          Thank you for shopping with StrideFire
        </p>

        {/* ── ORDER DETAILS ── */}
        <div className="success-details">
          <div className="success-detail-row">
            <span className="detail-label">Order ID</span>
            <span className="detail-value">#{order.orderId}</span>
          </div>
          <div className="success-detail-row">
            <span className="detail-label">Total Amount</span>
            <span className="detail-value">
              ₹{(order.total || 0).toLocaleString()}
            </span>
          </div>
          <div className="success-detail-row">
            <span className="detail-label">Payment Method</span>
            <span className="detail-value">{order.paymentMethod}</span>
          </div>
          <div className="success-detail-row">
            <span className="detail-label">Status</span>
            <span
              className="detail-value
                            status-confirmed"
            >
              ✅ Confirmed
            </span>
          </div>
        </div>

        {/* ── BUTTONS ── */}
        <div className="success-buttons">
          <Link to="/shop" className="btn-primary">
            <FiShoppingBag />
            Continue Shopping
          </Link>
          <Link to="/" className="btn-secondary">
            <FiHome />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
