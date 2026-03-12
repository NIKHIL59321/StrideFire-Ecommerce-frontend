import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiShoppingCart } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import HeroBanner from "../components/HeroBanner";
import { getAllProducts } from "../services/productService";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { addItem } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        // Show only first 4 products
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ─────────────────────────────────────────
  // HANDLE ADD TO CART
  // ─────────────────────────────────────────
  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      setAddingId(product.id);
      await addItem(user.id, product.id, 1);
    } catch (error) {
      console.log("Error adding to cart:", error);
    } finally {
      setAddingId(null);
    }
  };

  // ─────────────────────────────────────────
  // CATEGORIES
  // ─────────────────────────────────────────
  const categories = [
    {
      name: "Running",
      icon: "🏃",
      desc: "Built for speed",
    },
    {
      name: "Casual",
      icon: "👟",
      desc: "Everyday comfort",
    },
    {
      name: "Sports",
      icon: "⚽",
      desc: "Peak performance",
    },
    {
      name: "Formal",
      icon: "👔",
      desc: "Style and class",
    },
  ];

  return (
    <div className="home-page">
      {/* ── HERO BANNER ── */}
      <div className="container">
        <HeroBanner />
      </div>

      {/* ── CATEGORIES ── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Find the perfect shoe for every occasion
            </p>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.name}`}
                className="category-card"
              >
                <span className="category-icon">{cat.icon}</span>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.desc}</p>
                <span className="category-arrow">
                  <FiArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Our most popular picks</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products yet</h3>
              <p>Check back soon!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  {/* Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="product-image-wrapper"
                  >
                    <img
                      src={
                        product.imageUrl ||
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                      }
                      alt={product.name}
                      className="product-image"
                    />
                    {product.stocks === 0 && (
                      <span className="out-of-stock-badge">Out of Stock</span>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="product-info">
                    <span className="product-brand">{product.brand}</span>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="product-name">{product.name}</h3>
                    </Link>
                    <div className="product-footer">
                      <span className="product-price">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button
                        className="add-to-cart-btn"
                        disabled={
                          product.stocks === 0 || addingId === product.id
                        }
                        onClick={() => handleAddToCart(product)}
                      >
                        {addingId === product.id ? "..." : <FiShoppingCart />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="view-all-wrapper">
            <Link to="/shop" className="btn-primary">
              View All Products
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-card">
            <div className="promo-content">
              <FaFire className="promo-icon" />
              <h2 className="promo-title">Get 20% Off Your First Order!</h2>
              <p className="promo-subtitle">
                Use code <span className="promo-code">STRIDE20</span> at
                checkout
              </p>
              <Link to="/shop" className="promo-btn">
                Shop Now
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
