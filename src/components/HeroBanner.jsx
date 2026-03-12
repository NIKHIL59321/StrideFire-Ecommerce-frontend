import { Link } from 'react-router-dom'
import { FaFire } from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'

const HeroBanner = () => {
    return (
        <section className='hero'>
            <div className='hero-content'>

                <div className='hero-badge'>
                    <FaFire className='hero-badge-icon'/>
                    <span>New Collection 2026</span>
                </div>

                <h1 className='hero-title'>
                    Step Into Your
                    <span className='hero-title-highlight'>
                        {' '}Best Stride
                    </span>
                </h1>

                <p className='hero-subtitle'>
                    Premium shoes for every occasion.
                    Comfort, style and performance
                    in every step.
                </p>

                <div className='hero-buttons'>
                    <Link to='/shop' className='hero-btn-primary'>
                        Shop Now <FiArrowRight/>
                    </Link>
                    <Link to='/shop' className='hero-btn-secondary'>
                        View Collection
                    </Link>
                </div>

               <div className="hero-stats">
                    <div className="hero-stat">
                        <span className="hero-stat-number">
                            500+
                        </span>
                        <span className="hero-stat-label">
                            Products
                        </span>
                    </div>
                    <div className="hero-stat-divider" />
                    <div className="hero-stat">
                        <span className="hero-stat-number">
                            10k+
                        </span>
                        <span className="hero-stat-label">
                            Customers
                        </span>
                    </div>
                    <div className="hero-stat-divider" />
                    <div className="hero-stat">
                        <span className="hero-stat-number">
                            4.9★
                        </span>
                        <span className="hero-stat-label">
                            Rating
                        </span>
                    </div>
                </div>

            </div>

            {/* ── HERO IMAGE ── */}
            <div className="hero-image-wrapper">
                <div className="hero-image-bg" />
                <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
                    alt="StrideFire Hero Shoe"
                    className="hero-image"
                />
            </div>

        </section>
    )
}

export default HeroBanner