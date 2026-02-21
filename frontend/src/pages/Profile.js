import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateSuccess, setUpdateSuccess] = useState('');

    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: ''
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Load user data
        const userData = localStorage.getItem('user');
        if (userData) {
            const userObj = JSON.parse(userData);
            setProfileData({
                fullName: userObj.fullName || '',
                email: userObj.email || '',
                phone: userObj.phone || '',
                address: userObj.address || '',
                city: userObj.city || ''
            });
        }

        // Load user orders
        fetchUserOrders();
    }, [navigate, isAuthenticated]);

    const fetchUserOrders = async () => {
        const userData = localStorage.getItem('user');
        if (!userData) return;

        const userObj = JSON.parse(userData);

        try {
            const response = await fetch(`http://localhost:5000/api/orders/user/${userObj._id}`);
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateSuccess('');

        const userData = localStorage.getItem('user');
        if (!userData) return;

        const userObj = JSON.parse(userData);

        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUpdateSuccess('Cập nhật thông tin thành công!');
                setTimeout(() => setUpdateSuccess(''), 3000);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'processing': return 'Đang xử lý';
            case 'shipped': return 'Đang giao hàng';
            case 'delivered': return 'Đã giao hàng';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isAuthenticated()) {
        return null;
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 section-title">
                <i className="fas fa-user-circle me-2"></i>Tài khoản của tôi
            </h2>

            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 mb-4">
                    <div className="glass rounded-4 p-4">
                        <div className="text-center mb-4">
                            <div className="avatar-circle mx-auto mb-3">
                                <i className="fas fa-user fa-3x" style={{ color: '#003399' }}></i>
                            </div>
                            <h5 style={{ color: '#003399' }}>{profileData.fullName}</h5>
                            <small className="text-muted">{profileData.email}</small>
                        </div>

                        <div className="list-group list-group-flush">
                            <button
                                className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                                style={{ borderRadius: '10px', marginBottom: '5px' }}
                            >
                                <i className="fas fa-user me-2"></i>Thông tin cá nhân
                            </button>
                            <button
                                className={`list-group-item list-group-item-action ${activeTab === 'orders' ? 'active' : ''}`}
                                onClick={() => setActiveTab('orders')}
                                style={{ borderRadius: '10px', marginBottom: '5px' }}
                            >
                                <i className="fas fa-shopping-bag me-2"></i>Đơn hàng của tôi
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={handleLogout}
                                style={{ borderRadius: '10px', color: '#ff1744' }}
                            >
                                <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="col-md-9">
                    {activeTab === 'profile' && (
                        <div className="glass rounded-4 p-4">
                            <h4 className="mb-4" style={{ color: '#003399' }}>
                                <i className="fas fa-edit me-2"></i>Thông tin cá nhân
                            </h4>

                            {updateSuccess && (
                                <div className="alert alert-success" role="alert">
                                    <i className="fas fa-check-circle me-2"></i>
                                    {updateSuccess}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Họ và tên</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleChange}
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={profileData.email}
                                            disabled
                                        />
                                        <small className="text-muted">Email không thể thay đổi</small>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleChange}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Địa chỉ giao hàng</label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        value={profileData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Nhập địa chỉ (số nhà, đường, phường/xã)"
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Thành phố/Tỉnh</label>
                                    <select
                                        className="form-select"
                                        name="city"
                                        value={profileData.city}
                                        onChange={handleChange}
                                    >
                                        <option value="">Chọn thành phố/tỉnh</option>
                                        <option value="Hà Nội">Hà Nội</option>
                                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                        <option value="Đà Nẵng">Đà Nẵng</option>
                                        <option value="Hải Phòng">Hải Phòng</option>
                                        <option value="Cần Thơ">Cần Thơ</option>
                                        <option value="An Giang">An Giang</option>
                                        <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                                        <option value="Bắc Giang">Bắc Giang</option>
                                        <option value="Bắc Kạn">Bắc Kạn</option>
                                        <option value="Bạc Liêu">Bạc Liêu</option>
                                        <option value="Bắc Ninh">Bắc Ninh</option>
                                        <option value="Bến Tre">Bến Tre</option>
                                        <option value="Bình Định">Bình Định</option>
                                        <option value="Bình Dương">Bình Dương</option>
                                        <option value="Bình Phước">Bình Phước</option>
                                        <option value="Bình Thuận">Bình Thuận</option>
                                        <option value="Cà Mau">Cà Mau</option>
                                        <option value="Cao Bằng">Cao Bằng</option>
                                        <option value="Đắk Lắk">Đắk Lắk</option>
                                        <option value="Đắk Nông">Đắk Nông</option>
                                        <option value="Điện Biên">Điện Biên</option>
                                        <option value="Đồng Nai">Đồng Nai</option>
                                        <option value="Đồng Tháp">Đồng Tháp</option>
                                        <option value="Gia Lai">Gia Lai</option>
                                        <option value="Hà Giang">Hà Giang</option>
                                        <option value="Hà Nam">Hà Nam</option>
                                        <option value="Hà Tĩnh">Hà Tĩnh</option>
                                        <option value="Hải Dương">Hải Dương</option>
                                        <option value="Hậu Giang">Hậu Giang</option>
                                        <option value="Hòa Bình">Hòa Bình</option>
                                        <option value="Hưng Yên">Hưng Yên</option>
                                        <option value="Khánh Hòa">Khánh Hòa</option>
                                        <option value="Kiên Giang">Kiên Giang</option>
                                        <option value="Kon Tum">Kon Tum</option>
                                        <option value="Lai Châu">Lai Châu</option>
                                        <option value="Lâm Đồng">Lâm Đồng</option>
                                        <option value="Lạng Sơn">Lạng Sơn</option>
                                        <option value="Lào Cai">Lào Cai</option>
                                        <option value="Long An">Long An</option>
                                        <option value="Nam Định">Nam Định</option>
                                        <option value="Nghệ An">Nghệ An</option>
                                        <option value="Ninh Bình">Ninh Bình</option>
                                        <option value="Ninh Thuận">Ninh Thuận</option>
                                        <option value="Phú Thọ">Phú Thọ</option>
                                        <option value="Phú Yên">Phú Yên</option>
                                        <option value="Quảng Bình">Quảng Bình</option>
                                        <option value="Quảng Nam">Quảng Nam</option>
                                        <option value="Quảng Ngãi">Quảng Ngãi</option>
                                        <option value="Quảng Ninh">Quảng Ninh</option>
                                        <option value="Quảng Trị">Quảng Trị</option>
                                        <option value="Sóc Trăng">Sóc Trăng</option>
                                        <option value="Sơn La">Sơn La</option>
                                        <option value="Tây Ninh">Tây Ninh</option>
                                        <option value="Thái Bình">Thái Bình</option>
                                        <option value="Thái Nguyên">Thái Nguyên</option>
                                        <option value="Thanh Hóa">Thanh Hóa</option>
                                        <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                                        <option value="Tiền Giang">Tiền Giang</option>
                                        <option value="Trà Vinh">Trà Vinh</option>
                                        <option value="Tuyên Quang">Tuyên Quang</option>
                                        <option value="Vĩnh Long">Vĩnh Long</option>
                                        <option value="Vĩnh Phúc">Vĩnh Phúc</option>
                                        <option value="Yên Bái">Yên Bái</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save me-2"></i>Lưu thông tin
                                </button>
                            </form>

                            {profileData.address && (
                                <div className="mt-4 p-3 rounded-3" style={{ background: 'rgba(0,51,153,0.1)' }}>
                                    <h6 style={{ color: '#003399' }}>
                                        <i className="fas fa-map-marker-alt me-2"></i>Địa chỉ giao hàng mặc định:
                                    </h6>
                                    <p className="mb-0">
                                        {profileData.address}{profileData.city ? `, ${profileData.city}` : ''}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="glass rounded-4 p-4">
                            <h4 className="mb-4" style={{ color: '#003399' }}>
                                <i className="fas fa-shopping-bag me-2"></i>Đơn hàng của tôi
                            </h4>

                            {loading ? (
                                <div className="spinner"></div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
                                    <h5 style={{ color: '#003399' }}>Bạn chưa có đơn hàng nào</h5>
                                    <Link to="/products" className="btn btn-primary mt-3">
                                        <i className="fas fa-shopping-bag me-2"></i>Mua sắm ngay
                                    </Link>
                                </div>
                            ) : (
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <div key={order._id} className="order-card mb-4 p-4 rounded-4" style={{
                                            background: 'rgba(255,255,255,0.5)',
                                            border: '1px solid rgba(0,51,153,0.1)'
                                        }}>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h5 className="mb-1" style={{ color: '#003399' }}>
                                                        Đơn hàng #{order._id}
                                                    </h5>
                                                    <small className="text-muted">
                                                        <i className="fas fa-calendar me-1"></i>
                                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                    </small>
                                                </div>
                                                <span className={`badge bg-${getStatusColor(order.status)}`} style={{ padding: '8px 15px' }}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-8">
                                                    <h6 className="mb-2">Sản phẩm:</h6>
                                                    {order.products.map((product, index) => (
                                                        <div key={index} className="d-flex align-items-center mb-2">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                                            />
                                                            <div className="ms-3">
                                                                <small className="fw-bold">{product.name}</small>
                                                                <br />
                                                                <small className="text-muted">x{product.quantity} - {formatPrice(product.price)}</small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="col-md-4 text-md-end">
                                                    <h6 className="mb-1">Tổng tiền:</h6>
                                                    <h4 style={{ color: '#003399' }}>{formatPrice(order.totalAmount)}</h4>
                                                    <small className="text-muted">
                                                        {order.customerName}<br />
                                                        {order.customerPhone}
                                                    </small>
                                                </div>
                                            </div>

                                            {order.customerAddress && (
                                                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,51,153,0.1)' }}>
                                                    <small>
                                                        <i className="fas fa-map-marker-alt me-1" style={{ color: '#003399' }}></i>
                                                        Địa chỉ giao: {order.customerAddress}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
