import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiShoppingCart, FiArrowLeft, FiMinus, FiPlus } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { getProductById, getAllProducts } from "../services/productService";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import "../styles/product.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setAdded(false);
        setQuantity(1);
        setError("");

        const data = await getProductById(id);
        setProduct(data);
        // Fetch related products
        const all = await getAllProducts();
        const relatedProducts = all
          .filter((p) => p.category === data.category && p.id !== data.id)
          .slice(0, 4);
        setRelated(relatedProducts);
      } catch (err) {
        console.log("Error fetching product:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const increaseQty = () => {
    if (quantity < product.stocks) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      const result = await addItem(user.id, product.id, quantity);
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
      } else {
        setError(result.error || "Failed to add to cart");
      }
    } catch (err) {
      console.log(err)
      setError("Something went wrong while adding to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="empty-state">
        <h3>Product not found</h3>
        <p>The product you are looking for does not exist</p>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* ── BACK BUTTON ── */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft />
          Back
        </button>

        {/* ── PRODUCT SECTION ── */}
        <div className="product-detail-grid">
          {/* ── IMAGE ── */}
          <div className="detail-image-wrapper">
            <img
              src={
                product.imageUrl ||
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
              }
              alt={product.name}
              className="detail-image"
            />
            {product.stocks === 0 && (
              <div className="detail-out-of-stock">Out of Stock</div>
            )}
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="detail-info">
            {/* Brand */}
            <div className="detail-brand-row">
              <span className="detail-brand">{product.brand}</span>
              <span className="detail-category">{product.category}</span>
            </div>

            {/* Name */}
            <h1 className="detail-name">{product.name}</h1>

            {/* Price */}
            <div className="detail-price-row">
              <span className="detail-price">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="detail-tax">Inclusive of all taxes</span>
            </div>

            <div className="detail-divider" />

            {/* Size + Color */}
            <div className="detail-specs">
              <div className="detail-spec">
                <span className="spec-label">Size</span>
                <span className="spec-value">{product.size}</span>
              </div>
              <div className="detail-spec">
                <span className="spec-label">Color</span>
                <span className="spec-value">{product.color}</span>
              </div>
            </div>

            {/* Stock Status */}
            <div
              className={`detail-stock
                            ${product.stocks > 0 ? "in-stock" : "out-stock"}`}
            >
              {product.stocks > 0
                ? `✅ In Stock
                                   (${product.stocks} available)`
                : "❌ Out of Stock"}
            </div>

            {/* Error */}
            {error && <div className="error-box">{error}</div>}

            {/* Success */}
            {added && (
              <div className="success-box">✅ Added to cart successfully!</div>
            )}

            {/* Quantity + Add to Cart */}
            {product.stocks > 0 && (
              <div className="detail-actions">
                {/* Quantity Selector */}
                <div className="quantity-selector">
                  <button
                    className="qty-btn"
                    onClick={decreaseQty}
                    disabled={quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={increaseQty}
                    disabled={quantity >= product.stocks}
                  >
                    <FiPlus />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  className="detail-cart-btn"
                  onClick={handleAddToCart}
                  disabled={adding}
                >
                  <FiShoppingCart />
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            )}

            {/* Go to Cart */}
            {added && (
              <Link to="/cart" className="go-to-cart-btn">
                Go to Cart →
              </Link>
            )}

            <div className="detail-divider" />

            {/* Features */}
            <div className="detail-features">
              <div className="feature">
                <FaFire className="feature-icon" />
                <span>Premium Quality</span>
              </div>
              <div className="feature">
                <FaFire className="feature-icon" />
                <span>Free Shipping</span>
              </div>
              <div className="feature">
                <FaFire className="feature-icon" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div className="related-section">
            <h2 className="section-title">Related Products</h2>
            <div className="related-grid">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="related-card"
                >
                  <img
                    src={
                      p.imageUrl ||
                      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                    }
                    alt={p.name}
                    className="related-image"
                  />
                  <div className="related-info">
                    <span className="related-brand">{p.brand}</span>
                    <h4 className="related-name">{p.name}</h4>
                    <span className="related-price">
                      ₹{p.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
