import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchCart(user.id);
    }
  }, [isLoggedIn]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery("");
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <FaFire className="logo-icon" />
          <span className="logo-text">StrideFire</span>
        </Link>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" className="nav-link" onClick={closeMenu}>
              Shop
            </Link>
          </li>
          <li>
            <Link to="/orders" className="nav-link" onClick={closeMenu}>
              Orders
            </Link>
          </li>
          <li className="mobile-search">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search Shoes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <FiSearch />
              </button>
            </form>
          </li>
          <li className="mobile-auth">
            {isLoggedIn ? (
              <div className="mobile-user">
                <span className="mobile-username">👋 {user?.name}</span>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="mobile-auth-links">
                <Link to="/login" className="btn-login" onClick={closeMenu}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-register"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </li>
        </ul>

        <div className="navbar-right">
          <div
            className={`search-wrapper
              ${searchOpen ? "active" : ""}`}
          >
            {searchOpen && (
              <form onSubmit={handleSearch} className="search-form-desktop">
                <input
                  type="text"
                  placeholder="Search shoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-desktop"
                  autoFocus
                />
              </form>
            )}
            <button
              className="icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FiSearch />
            </button>
          </div>

          <Link to="/cart" className="cart-wrapper">
            <FiShoppingCart className="cart-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <div className="auth-wrapper">
            {isLoggedIn ? (
              <div className="user-menu">
                <span className="username">👋 {user?.name}</span>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn-login">
                  Login
                </Link>
                <Link to="/register" className="btn-register">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button className="hamburger" onClick={toggleMenu}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
