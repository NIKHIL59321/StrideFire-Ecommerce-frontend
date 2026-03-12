import { useState } from "react";
import { FiCreditCard } from "react-icons/fi";
import { BsPhone } from "react-icons/bs";

const PaymentForm = ({ onPaymentDataChange }) => {
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  //const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // ─────────────────────────────────────────
  // HANDLE METHOD CHANGE
  // ─────────────────────────────────────────
  const handleMethodChange = (method) => {
    setPaymentMethod(method);
    onPaymentDataChange({
      paymentMethod: method,
      upiId: "",
      cardData: cardData,
    });
  };

  // ─────────────────────────────────────────
  // HANDLE UPI CHANGE
  // ─────────────────────────────────────────
  /*const handleUpiChange = (value) => {
    setUpiId(value);
    onPaymentDataChange({
      paymentMethod: paymentMethod,
      upiId: value,
      cardData: cardData,
    });
  };*/

  // ─────────────────────────────────────────
  // HANDLE CARD CHANGE
  // ─────────────────────────────────────────
  const handleCardChange = (field, value) => {
    const updated = { ...cardData, [field]: value };
    setCardData(updated);
    onPaymentDataChange({
      paymentMethod: paymentMethod,
      //upiId: upiId,
      cardData: updated,
    });
  };

  // ─────────────────────────────────────────
  // FORMAT CARD NUMBER
  // ─────────────────────────────────────────
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  // ─────────────────────────────────────────
  // FORMAT EXPIRY
  // ─────────────────────────────────────────
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="payment-form">
      {/* ── METHOD TABS ── */}
      <div className="payment-tabs">
        <button
          className={`payment-tab
                        ${paymentMethod === "CARD" ? "active" : ""}`}
          onClick={() => handleMethodChange("CARD")}
        >
          <FiCreditCard />
          Card
        </button>
        <button
          className={`payment-tab
                        ${paymentMethod === "UPI" ? "active" : ""}`}
          onClick={() => handleMethodChange("UPI")}
        >
          <BsPhone />
          UPI
        </button>
      </div>

      {/* ── CARD FORM ── */}
      {paymentMethod === "CARD" && (
        <div className="card-form">
          {/* Card Number */}
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={cardData.number}
              onChange={(e) =>
                handleCardChange("number", formatCardNumber(e.target.value))
              }
            />
          </div>

          {/* Card Name */}
          <div className="form-group">
            <label className="form-label">Name on Card</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) => handleCardChange("name", e.target.value)}
            />
          </div>

          {/* Expiry + CVV */}
          <div className="card-row">
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="MM/YY"
                maxLength={5}
                value={cardData.expiry}
                onChange={(e) =>
                  handleCardChange("expiry", formatExpiry(e.target.value))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                type="password"
                className="form-input"
                placeholder="•••"
                maxLength={3}
                value={cardData.cvv}
                onChange={(e) =>
                  handleCardChange("cvv", e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </div>

          {/* Test Card Note */}
          <div className="test-card-note">
            🧪 Test Card: 4242 4242 4242 4242 | Any future date | Any CVV
          </div>
        </div>
      )}

      {/* ── UPI FORM ── */}
      {paymentMethod === 'UPI' && (
    <div className="upi-unavailable">
        <span className="upi-unavailable-icon">
            🚧
        </span>
        <div className="upi-unavailable-text">
            <h4>UPI Payment Unavailable</h4>
            <p>
                UPI payment method is currently
                down. Please use Card payment
                instead.
            </p>
        </div>
    </div>
)}
    </div>
  );
};

export default PaymentForm;
