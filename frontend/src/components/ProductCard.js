import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => {
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleCardClick = () => {
        navigate(`/products/${product._id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent navigating to detail when clicking add to cart
        addToCart(product);
    };

    return (
        <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '220px', objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                />
                <span className="category-badge" style={{ position: 'absolute', top: '15px', right: '15px' }}>
                    {product.category}
                </span>
            </div>
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '40px'
                }}>
                    {product.description}
                </p>
                <p className="product-price">{formatPrice(product.price)}</p>
                <button
                    className="btn btn-primary w-100"
                    onClick={handleAddToCart}
                    style={{ marginTop: 'auto' }}
                >
                    <i className="fas fa-cart-plus me-2"></i>Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
