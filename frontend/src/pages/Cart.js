import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
        calculateTotal(cart);
    }, []);

    const calculateTotal = (cart) => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = cartItems.map(item => {
            if (item._id === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    const removeItem = (productId) => {
        const updatedCart = cartItems.filter(item => item._id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
        setTotalAmount(0);
    };

    if (cartItems.length === 0) {
        return (
            <div className="container my-5 text-center">
                <div className="glass rounded-4 p-5">
                    <i className="fas fa-shopping-cart fa-5x text-muted mb-4" style={{ color: '#003399' }}></i>
                    <h2 style={{ color: '#003399' }}>Giỏ hàng trống</h2>
                    <p className="text-muted">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
                    <Link to="/products" className="btn btn-primary mt-3">
                        <i className="fas fa-shopping-bag me-2"></i>Mua sắm ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 section-title">
                <i className="fas fa-shopping-cart me-2"></i>Giỏ hàng của bạn
            </h2>

            <div className="row">
                <div className="col-md-8">
                    {cartItems.map(item => (
                        <div className="cart-item" key={item._id}>
                            <div className="row align-items-center">
                                <div className="col-md-2">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="img-fluid rounded"
                                        style={{ maxHeight: '80px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                                        }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <h5 style={{ color: '#003399' }}>{item.name}</h5>
                                    <p className="text-muted mb-0">{formatPrice(item.price)}</p>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex align-items-center">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="mx-3 fw-bold">{item.quantity}</span>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-2 text-end">
                                    <h5 className="cart-item-price">{formatPrice(item.price * item.quantity)}</h5>
                                </div>
                                <div className="col-md-1 text-end">
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeItem(item._id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline-danger mt-3" onClick={clearCart}>
                        <i className="fas fa-trash me-2"></i>Xóa tất cả
                    </button>
                </div>

                <div className="col-md-4">
                    <div className="cart-summary">
                        <h4 className="mb-4">
                            <i className="fas fa-receipt me-2"></i>Tổng quan đơn hàng
                        </h4>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Tổng sản phẩm:</span>
                            <span className="fw-bold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Tạm tính:</span>
                            <span>{formatPrice(totalAmount)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Phí vận chuyển:</span>
                            <span style={{ color: '#00c853' }}>Miễn phí</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-4">
                            <strong>Tổng cộng:</strong>
                            <strong className="total-price">
                                {formatPrice(totalAmount)}
                            </strong>
                        </div>
                        <Link to="/checkout" className="btn btn-success w-100">
                            <i className="fas fa-credit-card me-2"></i>Tiến hành thanh toán
                        </Link>
                        <Link to="/products" className="btn btn-outline-primary w-100 mt-3">
                            <i className="fas fa-arrow-left me-2"></i>Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
