import { FaFacebook, FaFire, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import './Footer.css'


const Footer = ()=> {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <FaFire className="footer-logo-icon"/>
              <span>StrideFire</span>
            </Link>
            <p className="footer-desc">
              Premium shoes for every stride.
              Step into comfort, style and performance
              with StrideFire.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"
                aria-label="Instagram">
                  <FaInstagram />
              </a>
              <a href="#" className="social-icon"
                aria-label="Facebook">
                  <FaFacebook />
              </a>
              <a href="#" className="social-icon"
                aria-label="Twitter">
                  <FaTwitter />
              </a>
              <a href="#" className="social-icon"
                aria-label="YouTube">
                  <FaYoutube />
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4 className="footer-heading">Categories</h4>
            <ul>
              <li><Link to="/shop?category=Running">Running</Link></li>
              <li><Link to="/shop?category=Casual">Casual</Link></li>
              <li><Link to="/shop?category=Sports">Sports</Link></li>
              <li><Link to="/shop?category=Formal">Formal</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 StrideFire.
            All rights reserved.
          </p>
        </div>
      </div>
        
    </footer>
  );
}
export default Footer;