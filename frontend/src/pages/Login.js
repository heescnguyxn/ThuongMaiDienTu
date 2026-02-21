import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        login: '',
        password: ''
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
        setLoading(true);

        const result = await login(formData.login, formData.password);

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
                <div className="col-md-5">
                    <div className="auth-form glass">
                        <div className="text-center mb-4">
                            <i className="fas fa-user-circle fa-4x" style={{ color: '#003399' }}></i>
                            <h2 className="mt-3" style={{ color: '#003399' }}>Đăng nhập</h2>
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Tên đăng nhập hoặc Email *</label>
                                <div className="input-group">
                                    <span className="input-group-text" style={{
                                        background: 'rgba(0,51,153,0.1)',
                                        border: '2px solid rgba(0,51,153,0.2)',
                                        borderRadius: '15px 0 0 15px'
                                    }}>
                                        <i className="fas fa-envelope" style={{ color: '#003399' }}></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="login"
                                        value={formData.login}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập tên đăng nhập hoặc email"
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
                                        placeholder="Nhập mật khẩu"
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
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt me-2"></i>Đăng nhập
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="mb-0">Chưa có tài khoản?
                                <Link to="/register" style={{ color: '#003399', fontWeight: '600' }}>
                                    {' '}Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
