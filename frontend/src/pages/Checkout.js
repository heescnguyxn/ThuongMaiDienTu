import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: ''
    });
    const [hasSavedAddress, setHasSavedAddress] = useState(false);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            navigate('/cart');
            return;
        }
        setCartItems(cart);
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);

        // Pre-fill user info if logged in (from profile)
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            const fullAddress = user.address
                ? `${user.address}${user.city ? ', ' + user.city : ''}`
                : '';
            setFormData({
                customerName: user.fullName || '',
                customerEmail: user.email || '',
                customerPhone: user.phone || '',
                customerAddress: fullAddress
            });
            // Check if user has saved address in profile
            setHasSavedAddress(!!user.address);
        }
    }, [navigate]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Get user ID if logged in
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        const orderData = {
            customerId: user ? user._id : null,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            customerAddress: formData.customerAddress,
            products: cartItems.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            totalAmount: totalAmount
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                setOrderSuccess(true);
                localStorage.removeItem('cart');
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container my-5 text-center">
                <div className="glass rounded-4 p-5">
                    <i className="fas fa-check-circle fa-5x mb-4" style={{ color: '#00c853' }}></i>
                    <h2 style={{ color: '#003399' }}>Đặt hàng thành công!</h2>
                    <p className="text-muted">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
                    <Link to="/" className="btn btn-primary mt-3">
                        <i className="fas fa-home me-2"></i>Trở về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 section-title">
                <i className="fas fa-credit-card me-2"></i>Thanh toán
            </h2>

            <div className="row">
                {/* Order Form */}
                <div className="col-md-7">
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <h4 className="mb-4">
                            <i className="fas fa-user me-2"></i>Thông tin khách hàng
                        </h4>

                        <div className="mb-3">
                            <label className="form-label">Họ và tên *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                                placeholder="Nhập họ và tên"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                className="form-control"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleChange}
                                required
                                placeholder="Nhập địa chỉ email"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Số điện thoại *</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                required
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Địa chỉ giao hàng *</label>
                            {hasSavedAddress && (
                                <div className="alert alert-info mb-2 py-2">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Địa chỉ đã được lấy từ thông tin cá nhân của bạn
                                </div>
                            )}
                            <textarea
                                className="form-control"
                                name="customerAddress"
                                value={formData.customerAddress}
                                onChange={handleChange}
                                required
                                rows="3"
                                placeholder="Nhập địa chỉ giao hàng"
                            ></textarea>
                            {!hasSavedAddress && (
                                <small className="text-muted">
                                    <Link to="/profile" style={{ color: '#003399' }}>
                                        <i className="fas fa-plus-circle me-1"></i>Lưu địa chỉ để lần sau mua hàng nhanh hơn
                                    </Link>
                                </small>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check me-2"></i>Đặt hàng ngay
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="col-md-5">
                    <div className="cart-summary">
                        <h4 className="mb-4">
                            <i className="fas fa-shopping-bag me-2"></i>Đơn hàng của bạn
                        </h4>

                        {cartItems.map(item => (
                            <div key={item._id} className="d-flex justify-content-between mb-2">
                                <div>
                                    <span style={{ color: '#003399', fontWeight: '600' }}>{item.name}</span>
                                    <br />
                                    <small className="text-muted">x{item.quantity}</small>
                                </div>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}

                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                            <span>Tạm tính:</span>
                            <span>{formatPrice(totalAmount)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Phí vận chuyển:</span>
                            <span style={{ color: '#00c853', fontWeight: '600' }}>Miễn phí</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-4">
                            <strong>Tổng cộng:</strong>
                            <strong className="total-price">
                                {formatPrice(totalAmount)}
                            </strong>
                        </div>

                        <Link to="/cart" className="btn btn-outline-primary w-100">
                            <i className="fas fa-arrow-left me-2"></i>Quay lại giỏ hàng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
