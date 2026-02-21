import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const [cartCount, setCartCount] = useState(0);
    const { user, logout, isAuthenticated } = useAuth();

    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
        };

        updateCartCount();

        // Listen for cart changes
        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    const handleLogout = () => {
        logout();
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top glass">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <i className="fas fa-shopping-bag me-2"></i>
                    PeePeeShop
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="fas fa-home me-1"></i> Trang chủ
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">
                                <i className="fas fa-box me-1"></i> Sản phẩm
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">
                                <i className="fas fa-shopping-cart me-1"></i> Giỏ hàng
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                        </li>

                        {isAuthenticated() ? (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                    <i className="fas fa-user me-1"></i> {user?.fullName || user?.username}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            <i className="fas fa-user-circle me-2"></i> Tài khoản của tôi
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            <i className="fas fa-address-card me-2"></i> Thông tin cá nhân
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            <i className="fas fa-shopping-bag me-2"></i> Đơn hàng của tôi
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="fas fa-sign-in-alt me-1"></i> Đăng nhập
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        <i className="fas fa-user-plus me-1"></i> Đăng ký
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
