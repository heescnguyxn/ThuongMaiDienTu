import React from 'react';

const Footer = () => {
    return (
        <footer className="footer glass">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5><i className="fas fa-shopping-bag me-2"></i>PeePeeShop</h5>
                        <p>Chuyên cung cấp các sản phẩm công nghệ chính hãng với giá tốt nhất thị trường.</p>
                    </div>
                    <div className="col-md-4">
                        <h5>Liên kết nhanh</h5>
                        <ul className="list-unstyled">
                            <li><a href="/">Trang chủ</a></li>
                            <li><a href="/products">Sản phẩm</a></li>
                            <li><a href="/cart">Giỏ hàng</a></li>
                            <li><a href="/checkout">Thanh toán</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Liên hệ</h5>
                        <ul className="list-unstyled">
                            <li><i className="fas fa-phone me-2"></i>0123 456 789</li>
                            <li><i className="fas fa-envelope me-2"></i>contact@onlineshop.com</li>
                            <li><i className="fas fa-map-marker-alt me-2"></i>Hà Nội, Việt Nam</li>
                        </ul>
                    </div>
                </div>
                <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <div className="text-center">
                    <p className="mb-0">&copy; 2024 PeePeeShop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
