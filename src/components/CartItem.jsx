import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleIncrease = async () => {
    try{
        setUpdating(true)
        await updateItem(user.id, item.productId, item.quantity + 1)
    }catch(err){
        console.error("Failed to increase quantity:", err);
    } finally{
        setUpdating(false)
    }
  }

  const handleDecrease = async () => {
    if(item.quantity<=1) return;
    try{
        setUpdating(true)
        await updateItem(user.id, item.productId, item.quantity - 1)
    }catch(err){
        console.error("Failed to decrease quantity:", err);
    } finally{
        setUpdating(false)
    }
  }

    const handleRemove = async () => {
        try{
            setRemoving(true)
            await removeItem(item.CartItemId, user.id)
        }catch(err){
            console.error("Failed to remove item:", err);
        } finally{
            setRemoving(false)
        }
    }

  return (
    <div
      className={`cart-item
            ${removing ? "removing" : ""}`}
    >
      {/* ── IMAGE ── */}
      <Link
        to={`/product/${item.productId}`}
        className="cart-item-image-wrapper"
      >
        <img
          src={
            item.imageUrl ||
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"
          }
          alt={item.productName || "Product"}
          className="cart-item-image"
        />
      </Link>

      {/* ── INFO ── */}
      <div className="cart-item-info">
        <Link to={`/product/${item.productId}`} className="cart-item-name">
          {item.productName || `Product #${item.productId}`}
        </Link>
        <div className="cart-item-meta">
          <span>Size: {item.size || "N/A"}</span>
          <span>Color: {item.color || "N/A"}</span>
        </div>
        <span className="cart-item-price">
          ₹{(item.price || 0).toLocaleString()}
        </span>
      </div>

      {/* ── QUANTITY ── */}
      <div className="cart-item-quantity">
        <button
          className="qty-btn"
          onClick={handleDecrease}
          disabled={updating || item.quantity <= 1}
        >
          <FiMinus />
        </button>
        <span className="qty-value">{updating ? "..." : item.quantity}</span>
        <button
          className="qty-btn"
          onClick={handleIncrease}
          disabled={updating}
        >
          <FiPlus />
        </button>
      </div>

      {/* ── SUBTOTAL ── */}
      <div className="cart-item-subtotal">
        ₹{((item.price || 0) * item.quantity).toLocaleString()}
      </div>

      {/* ── REMOVE ── */}
      <button
        className="cart-item-remove"
        onClick={handleRemove}
        disabled={removing}
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

export default CartItem;
