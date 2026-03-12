import { Link } from 'react-router-dom'
import { FiHome, FiShoppingBag } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'

const NotFound = () => {
    return (
        <div className="notfound-page">
            <div className="notfound-content">
                <FaFire className="notfound-icon" />
                <h1 className="notfound-title">404</h1>
                <h2 className="notfound-subtitle">
                    Page Not Found
                </h2>
                <p className="notfound-desc">
                    The page you are looking for
                    doesn't exist or has been moved
                </p>
                <div className="notfound-buttons">
                    <Link to="/" className="btn-primary">
                        <FiHome />
                        Go Home
                    </Link>
                    <Link to="/shop"
                          className="btn-secondary">
                        <FiShoppingBag />
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound