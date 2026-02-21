import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setLoading(false);
            });
    }, []);

    const addToCart = (product) => {
        // Kiểm tra đăng nhập trước khi thêm vào giỏ
        if (!isAuthenticated()) {
            const confirmLogin = window.confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập không?');
            if (confirmLogin) {
                navigate('/login');
            }
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item._id === product._id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        // Dispatch event để cập nhật số lượng giỏ hàng trong header
        window.dispatchEvent(new Event('cartUpdated'));

        alert('Đã thêm sản phẩm vào giỏ hàng!');
    };

    const categories = ['all', ...new Set(products.map(p => p.category))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 section-title">
                <i className="fas fa-box me-2"></i>Danh sách sản phẩm
            </h2>

            {/* Search and Filter */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="input-group">
                        <span className="input-group-text" style={{ background: 'rgba(0,51,153,0.1)', border: '2px solid rgba(0,51,153,0.2)', borderRadius: '15px 0 0 15px' }}>
                            <i className="fas fa-search" style={{ color: '#003399' }}></i>
                        </span>
                        <input
                            type="text"
                            className="form-control search-box"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <select
                        className="form-select"
                        style={{ borderRadius: '15px', border: '2px solid rgba(0,51,153,0.2)' }}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'Tất cả danh mục' : category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="spinner"></div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-5 glass rounded-4">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Không tìm thấy sản phẩm nào</p>
                </div>
            ) : (
                <div className="row">
                    {filteredProducts.map(product => (
                        <div className="col-md-3 mb-4" key={product._id}>
                            <ProductCard product={product} addToCart={addToCart} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
