import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data.slice(0, 4)); // Lấy 4 sản phẩm đầu tiên
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setLoading(false);
            });
    }, []);

    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item._id === product._id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Đã thêm sản phẩm vào giỏ hàng!');
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section text-center glass">
                <div className="container">
                    <h1>Chào mừng đến với PeePeeShop</h1>
                    <p className="lead">Khám phá các sản phẩm công nghệ chính hãng với giá tốt nhất</p>
                    <Link to="/products" className="btn btn-light btn-lg mt-3">
                        <i className="fas fa-shopping-bag me-2"></i>Mua sắm ngay
                    </Link>
                </div>
            </section>

            {/* Featured Products */}
            <div className="container">
                <h2 className="text-center mb-4 section-title">
                    <i className="fas fa-star me-2"></i>Sản phẩm nổi bật
                </h2>
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="row">
                        {products.map(product => (
                            <div className="col-md-3 mb-4" key={product._id}>
                                <ProductCard product={product} addToCart={addToCart} />
                            </div>
                        ))}
                    </div>
                )}
                <div className="text-center mt-4 mb-5">
                    <Link to="/products" className="btn btn-primary">
                        <i className="fas fa-eye me-2"></i>Xem tất cả sản phẩm
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="container my-5">
                <div className="row">
                    <div className="col-md-4 text-center mb-4">
                        <div className="p-4 glass rounded-4 h-100">
                            <i className="fas fa-shipping-fast fa-3x mb-3" style={{ color: '#003399' }}></i>
                            <h4>Giao hàng nhanh chóng</h4>
                            <p className="text-muted">Giao hàng trong 24h nội thành</p>
                        </div>
                    </div>
                    <div className="col-md-4 text-center mb-4">
                        <div className="p-4 glass rounded-4 h-100">
                            <i className="fas fa-shield-alt fa-3x mb-3" style={{ color: '#003399' }}></i>
                            <h4>Sản phẩm chính hãng</h4>
                            <p className="text-muted">100% sản phẩm chính hãng</p>
                        </div>
                    </div>
                    <div className="col-md-4 text-center mb-4">
                        <div className="p-4 glass rounded-4 h-100">
                            <i className="fas fa-headset fa-3x mb-3" style={{ color: '#003399' }}></i>
                            <h4>Hỗ trợ 24/7</h4>
                            <p className="text-muted">Luôn sẵn sàng hỗ trợ bạn</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
