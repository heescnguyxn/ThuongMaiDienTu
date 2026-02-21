import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra mật khẩu xác nhận
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.username,
            formData.email,
            formData.password,
            formData.fullName
        );

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="auth-form glass">
                        <div className="text-center mb-4">
                            <i className="fas fa-user-plus fa-4x" style={{ color: '#003399' }}></i>
                            <h2 className="mt-3" style={{ color: '#003399' }}>Đăng ký</h2>
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Tên đăng nhập *</label>
                                <div className="input-group">
                                    <span className="input-group-text" style={{
                                        background: 'rgba(0,51,153,0.1)',
                                        border: '2px solid rgba(0,51,153,0.2)',
                                        borderRadius: '15px 0 0 15px'
                                    }}>
                                        <i className="fas fa-user" style={{ color: '#003399' }}></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập tên đăng nhập"
                                        style={{ borderRadius: '0 15px 15px 0' }}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Họ và tên *</label>
                                <div className="input-group">
                                    <span className="input-group-text" style={{
                                        background: 'rgba(0,51,153,0.1)',
                                        border: '2px solid rgba(0,51,153,0.2)',
                                        borderRadius: '15px 0 0 15px'
                                    }}>
                                        <i className="fas fa-id-card" style={{ color: '#003399' }}></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập họ và tên"
                                        style={{ borderRadius: '0 15px 15px 0' }}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email *</label>
                                <div className="input-group">
                                    <span className="input-group-text" style={{
                                        background: 'rgba(0,51,153,0.1)',
                                        border: '2px solid rgba(0,51,153,0.2)',
                                        borderRadius: '15px 0 0 15px'
                                    }}>
                                        <i className="fas fa-envelope" style={{ color: '#003399' }}></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập địa chỉ email"
                                        style={{ borderRadius: '0 15px 15px 0' }}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Mật khẩu *</label>
                                <div className="input-group">
                                    <span className="input-group-text" style={{
                                        background: 'rgba(0,51,153,0.1)',
                                        border: '2px solid rgba(0,51,153,0.2)',
                                        borderRadius: '15px 0 0 15px'
                                    }}>
                                        <i className="fas fa-lock" style={{ color: '#003399' }}></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                        style={{ borderRadius: '0 15px 15px 0' }}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Xác nhận mật khẩu *</label>
                                <div className="input-group">
                                    <span className="input-group-text" style={{
                                        background: 'rgba(0,51,153,0.1)',
                                        border: '2px solid rgba(0,51,153,0.2)',
                                        borderRadius: '15px 0 0 15px'
                                    }}>
                                        <i className="fas fa-lock" style={{ color: '#003399' }}></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập lại mật khẩu"
                                        style={{ borderRadius: '0 15px 15px 0' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Đang đăng ký...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus me-2"></i>Đăng ký
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="mb-0">Đã có tài khoản?
                                <Link to="/login" style={{ color: '#003399', fontWeight: '600' }}>
                                    {' '}Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
