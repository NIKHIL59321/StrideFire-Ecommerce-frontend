import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";
import PaymentForm from "../components/PaymentForm";
import { placeOrder } from "../services/orderService";
import {
  createPaymentIntent,
  confirmPayment,
} from "../services/paymentService";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import "../styles/checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { cartItems, totalPrice, cartCount, fetchCart } = useCart();

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "CARD",
    upiId: "",
    cardData: {},
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // ✅ New state
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // ─────────────────────────────────────────
  // REDIRECT IF NOT LOGGED IN
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    if (cartItems && cartItems.length === 0 && !paymentConfirmed) {
      navigate("/cart");
    }
  }, [isLoggedIn, cartItems, navigate]);

  // ─────────────────────────────────────────
  // VALIDATE PAYMENT DATA
  // ─────────────────────────────────────────
  const validatePayment = () => {
    if (paymentData.paymentMethod === "UPI") {
      if (!paymentData.upiId || !paymentData.upiId.includes("@")) {
        setError("Please enter a valid UPI ID");
        return false;
      }
    }
    if (paymentData.paymentMethod === "CARD") {
      const { number, expiry, cvv, name } = paymentData.cardData;
      if (!number || number.replace(/\s/g, "").length < 16) {
        setError("Please enter valid card number");
        return false;
      }
      if (!name) {
        setError("Please enter name on card");
        return false;
      }
      if (!expiry || expiry.length < 5) {
        setError("Please enter valid expiry date");
        return false;
      }
      if (!cvv || cvv.length < 3) {
        setError("Please enter valid CVV");
        return false;
      }
    }
    return true;
  };

  // ─────────────────────────────────────────
  // HANDLE PLACE ORDER
  // ─────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setError("");

    if (!validatePayment()) return;

    try {
      setLoading(true);

      // ── Step 1 — Place Order ──
      setStep(1);
      const orderData = await placeOrder(user.id);

      if (orderData.error) {
        setError(orderData.error);
        return;
      }

      const orderId = orderData.orderId;

      // ── Step 2 — Create Payment Intent ──
      setStep(2);
      const paymentIntent = await createPaymentIntent({
        orderId: orderId,
        userId: user.id,
        paymentMethod: paymentData.paymentMethod,
        upiId: paymentData.upiId || null,
        currency: "INR",
      });

      if (paymentIntent.error) {
        setError(paymentIntent.error);
        return;
      }

      const transactionId = paymentIntent.transactionId;

      // ── Step 3 — Confirm Payment ──
      setStep(3);
      const confirmation = await confirmPayment(transactionId);

      if (confirmation.error) {
        setError(confirmation.error);
        return;
      }

      // ── Step 4 — Show Confirmed ──
      setStep(4);
      setPaymentConfirmed(true);

      // ✅ Wait 2.5 seconds to show banner
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // ── Step 5 — Navigate ──
      await fetchCart(user.id);

      navigate("/success", {
        state: {
          orderId: orderId,
          total: grandTotal,
          paymentMethod: paymentData.paymentMethod,
        },
      });
    } catch (err) {
      setError("Payment failed. Please try again");
      console.log("Checkout error:", err);
    } finally {
      setLoading(false);
      setStep(1);
      setPaymentConfirmed(false);
    }
  };

  // ─────────────────────────────────────────
  // SHIPPING COST
  // ─────────────────────────────────────────
  const shipping = totalPrice > 2000 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        {/* ── HEADER ── */}
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <div className="secure-badge">
            <FiLock />
            Secure Checkout
          </div>
        </div>

        {/* ── PAYMENT CONFIRMED BANNER ── */}
        {paymentConfirmed && (
          <div className="payment-confirmed-banner">
            <FiCheckCircle className="confirmed-icon" />
            <div className="confirmed-text">
              <h3>Payment Confirmed!</h3>
              <p>Redirecting to order summary...</p>
            </div>
          </div>
        )}

        {/* ── LOADING STEPS ── */}
        {loading && (
          <div className="checkout-steps">
            <div
              className={`checkout-step
                            ${step >= 1 ? "active" : ""}`}
            >
              <span className="step-number">{step > 1 ? "✓" : "1"}</span>
              <span>Placing Order</span>
            </div>

            <div className="step-line" />

            <div
              className={`checkout-step
                            ${step >= 2 ? "active" : ""}`}
            >
              <span className="step-number">{step > 2 ? "✓" : "2"}</span>
              <span>Processing Payment</span>
            </div>

            <div className="step-line" />

            <div
              className={`checkout-step
                            ${step >= 3 ? "active" : ""}`}
            >
              <span className="step-number">{step > 3 ? "✓" : "3"}</span>
              <span>Confirming</span>
            </div>

            <div className="step-line" />

            {/* ✅ Step 4 */}
            <div
              className={`checkout-step
                            ${step >= 4 ? "active" : ""}`}
            >
              <span className="step-number">{step >= 4 ? "✓" : "4"}</span>
              <span>Confirmed</span>
            </div>
          </div>
        )}

        {/* ── CHECKOUT BODY ── */}
        {/* ✅ Hide form when confirmed */}
        {!paymentConfirmed && (
          <div className="checkout-body">
            {/* ── LEFT — Payment ── */}
            <div className="checkout-left">
              <div className="checkout-section">
                <h3 className="checkout-section-title">Payment Details</h3>
                <PaymentForm onPaymentDataChange={setPaymentData} />
              </div>

              {/* Error */}
              {error && <div className="error-box">{error}</div>}

              {/* Place Order Button */}
              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>

            {/* ── RIGHT — Order Summary ── */}
            <div className="checkout-right">
              <div className="checkout-summary">
                <h3 className="summary-title">Order Summary</h3>

                {/* Items */}
                <div className="summary-items">
                  {cartItems &&
                    cartItems.map((item) => (
                      <div key={item.id} className="summary-item">
                        <div className="summary-item-info">
                          <span className="summary-item-name">
                            {item.productName || `Product #${item.productId}`}
                          </span>
                          <span className="summary-item-qty">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="summary-item-price">
                          ₹
                          {((item.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="summary-divider" />

                {/* Totals */}
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
                </div>

                <div className="summary-divider" />

                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
