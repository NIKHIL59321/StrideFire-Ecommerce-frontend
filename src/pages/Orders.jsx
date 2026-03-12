import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiArrowRight } from "react-icons/fi";
import { getOrders, cancelOrder } from "../services/orderService";
import useAuth from "../hooks/useAuth";
import "../styles/orders.css";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const tabs = ["ALL", "PLACED", "SHIPPED", "DELIVERED", "CANCELLED"];

  // ─────────────────────────────────────────
  // FETCH ORDERS
  // ─────────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders(user.id);

        console.log("Orders response:", data);
        console.log("First order:", data.orders?.[0]);
        console.log("First order status:", data.orders?.[0]?.status);

        const ordersList = Array.isArray(data.orders)
          ? data.orders
          : Array.isArray(data)
            ? data
            : [];

        setOrders(ordersList);
      } catch (error) {
        console.log("Failed to fetch orders:", error);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchOrders();
  }, [user]);

  // ─────────────────────────────────────────
  // FILTER ORDERS BY TAB
  // ─────────────────────────────────────────
  const filteredOrders =
    activeTab === "ALL"
      ? orders
      : orders.filter((order) => order.status?.toUpperCase() === activeTab);

  // ─────────────────────────────────────────
  // HANDLE CANCEL ORDER
  // ─────────────────────────────────────────
  const handleCancel = async (orderId) => {
    console.log("Cancel clicked! orderId:", orderId);
    console.log("userId:", user.id);

    if (!window.confirm("Are you sure you want to cancel?")) return;

    try {
      setCancellingId(orderId);

      await cancelOrder(orderId, parseInt(user.id));

      // ✅ Update status locally
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: "CANCELLED" } : order,
        ),
      );
    } catch (error) {
      console.log("Cancel failed:", error);
      setError("Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  // ─────────────────────────────────────────
  // STATUS BADGE CLASS
  // ─────────────────────────────────────────
  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
        return "status-placed";
      case "SHIPPED":
        return "status-shipped";
      case "DELIVERED":
        return "status-delivered";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "status-placed";
    }
  };

  // ─────────────────────────────────────────
  // FORMAT DATE
  // ─────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

              
  return (
    <div className="orders-page">
      <div className="container">
        {/* ── HEADER ── */}
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">Track and manage your orders</p>
        </div>

        {/* ── TABS ── */}
        <div className="orders-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`orders-tab
                                ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="tab-count">
                {tab === "ALL"
                  ? orders.length
                  : orders.filter((o) => o.status?.toUpperCase() === tab)
                      .length}
              </span>
            </button>
          ))}
        </div>

        {/* ── ERROR ── */}
        {error && <div className="error-box">{error}</div>}

        {/* ── LOADING ── */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <FiPackage className="empty-orders-icon" />
            <h3>
              No {activeTab === "ALL" ? "" : activeTab.toLowerCase()} orders
              found
            </h3>
            <p>
              {activeTab === "ALL"
                ? "You haven't placed any orders yet"
                : `No ${activeTab.toLowerCase()} orders`}
            </p>
            {activeTab === "ALL" && (
              <Link to="/shop" className="btn-primary">
                Start Shopping
                <FiArrowRight />
              </Link>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order, orderIndex) => (
               <div key={order.orderId || orderIndex} className="order-card">
                {/* ── ORDER HEADER ── */}
                <div className="order-card-header">
                  <div className="order-card-left">
                    <span className="order-id">Order #{order.orderId}</span>
                    <span className="order-date">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="order-card-right">
                    <span
                      className={`order-status
                        ${getStatusClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* ── ORDER ITEMS ── */}
                <div className="order-items">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, itemIndex) => (
                      <div
                        key={`order-${order.orderId}-item-${itemIndex}`}
                        className="order-item"
                      >
                        <img
                          src={
                            item.imageUrl ||
                            item.productImageUrl ||
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"
                          }
                          alt={item.productName || "Product"}
                          className="order-item-image"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100";
                          }}
                        />
                        <div className="order-item-info">
                          <span className="order-item-name">
                            {item.productName || `Product #${item.productId}`}
                          </span>
                          <span className="order-item-meta">
                            Qty: {item.quantity}
                            {item.size && ` | Size: ${item.size}`}
                          </span>
                        </div>
                        <span className="order-item-price">
                          ₹
                          {((item.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-items-text">No items found</p>
                  )}
                </div>

                {/* ── ORDER FOOTER ── */}
                <div className="order-card-footer">
                  <div className="order-total">
                    <span>Total Amount</span>
                    <span className="order-total-amount">
                      ₹{(order.total || 0).toLocaleString()}
                    </span>
                  </div>

                  {/* ✅ Cancel button */}
                  {order.status?.toUpperCase() === "PLACED" && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => {
                        console.log("Cancel btn clicked:", order.orderId);
                        handleCancel(order.orderId);
                      }}
                      disabled={cancellingId === order.orderId}
                    >
                      {cancellingId === order.orderId
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}
                  {/* ── PAYMENT STATUS ── */}
                  <div className="payment-status-row">
                    <span className="payment-label">Payment</span>
                    <span className={`payment-badge${
                      order.paymentStatus === "SUCCESS"
                      ? "payment-success"
                      : order.paymentStatus === "FAILED"
                        ? "payment-failed"
                        : "payment-pending"
                    }`}>
                      {order.paymentStatus === "SUCCESS"
                        ? "✅ Paid"
                        : order.paymentStatus === "PENDING"
                          ? "⏳ Pending"
                          : "❌ Failed"}
                    </span>
                    {order.paymentMethod && order.paymentMethod !== "N/A" && (
                      <span className="payment-method-badge">
                        {order.paymentMethod}
                      </span>
                    )}
                  </div>
                </div>
              </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
