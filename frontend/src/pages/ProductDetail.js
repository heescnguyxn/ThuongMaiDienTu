import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    useEffect(() => {
        // Fetch product details
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setLoading(false);
            });

        // Fetch reviews for this product
        fetch(`http://localhost:5000/api/reviews/product/${id}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data);
            })
            .catch(err => {
                console.error('Error fetching reviews:', err);
            });

        // Check if user has purchased this product
        const userData = localStorage.getItem('user');
        if (userData) {
            const userObj = JSON.parse(userData);
            fetch(`http://localhost:5000/api/orders/check-purchase/${userObj._id}/${id}`)
                .then(res => res.json())
                .then(data => {
                    setHasPurchased(data.hasPurchased);
                })
                .catch(err => {
                    console.error('Error checking purchase:', err);
                });
        }
    }, [id]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const addToCart = () => {
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
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        // Dispatch event để cập nhật số lượng giỏ hàng trong header
        window.dispatchEvent(new Event('cartUpdated'));

        alert('Đã thêm sản phẩm vào giỏ hàng!');
    };

    const buyNow = () => {
        if (!isAuthenticated()) {
            const confirmLogin = window.confirm('Bạn cần đăng nhập để mua hàng. Bạn có muốn đăng nhập không?');
            if (confirmLogin) {
                navigate('/login');
            }
            return;
        }

        // Thêm vào giỏ hàng và chuyển đến checkout
        const cart = [{ ...product, quantity }];
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/checkout');
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');
        setReviewLoading(true);

        const userData = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userData._id,
                    productId: id,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });

            const data = await response.json();

            if (response.ok) {
                setReviewSuccess('Đánh giá của bạn đã được gửi thành công!');
                setNewReview({ rating: 5, comment: '' });
                // Refresh reviews
                const reviewsRes = await fetch(`http://localhost:5000/api/reviews/product/${id}`);
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);
            } else {
                setReviewError(data.message);
            }
        } catch (error) {
            setReviewError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setReviewLoading(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i
                key={i}
                className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}
            ></i>
        ));
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    if (!product) {
        return (
            <div className="container my-5 text-center">
                <h2 style={{ color: '#003399' }}>Không tìm thấy sản phẩm</h2>
                <Link to="/products" className="btn btn-primary mt-3">
                    <i className="fas fa-arrow-left me-2"></i>Quay lại
                </Link>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/" style={{ color: '#003399' }}>Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/products" style={{ color: '#003399' }}>Sản phẩm</Link>
                    </li>
                    <li className="breadcrumb-item active" style={{ color: '#666' }}>
                        {product.name}
                    </li>
                </ol>
            </nav>

            <div className="row">
                {/* Product Image */}
                <div className="col-md-5 mb-4">
                    <div className="product-detail-image glass rounded-4 overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="img-fluid w-100"
                            style={{ objectFit: 'cover', maxHeight: '500px' }}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/500?text=No+Image';
                            }}
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="col-md-7">
                    <div className="product-detail-info glass rounded-4 p-4">
                        <span className="category-badge">{product.category}</span>
                        <h1 className="my-3" style={{ color: '#003399', fontWeight: '800' }}>
                            {product.name}
                        </h1>
                        <p className="text-muted mb-4">{product.description}</p>

                        <div className="d-flex align-items-center mb-4">
                            <span className="product-detail-price" style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                color: '#003399'
                            }}>
                                {formatPrice(product.price)}
                            </span>
                            <span className="ms-3 badge bg-success" style={{ fontSize: '0.9rem' }}>
                                Còn hàng ({product.stock})
                            </span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-4">
                            <label className="form-label" style={{ color: '#003399', fontWeight: '600' }}>
                                Số lượng:
                            </label>
                            <div className="d-flex align-items-center">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                                >
                                    <i className="fas fa-minus"></i>
                                </button>
                                <span className="mx-4 fw-bold" style={{ fontSize: '1.5rem', color: '#003399' }}>
                                    {quantity}
                                </span>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-3">
                            <button
                                className="btn btn-primary flex-fill"
                                onClick={addToCart}
                                style={{ padding: '15px 30px' }}
                            >
                                <i className="fas fa-cart-plus me-2"></i>Thêm vào giỏ
                            </button>
                            <button
                                className="btn btn-success flex-fill"
                                onClick={buyNow}
                                style={{ padding: '15px 30px' }}
                            >
                                <i className="fas fa-bolt me-2"></i>Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="row mt-5">
                <div className="col-12">
                    <div className="glass rounded-4 p-4">
                        <h3 className="mb-4" style={{ color: '#003399' }}>
                            <i className="fas fa-star me-2"></i>Đánh giá sản phẩm
                        </h3>

                        {/* Review Form - Only show if user has purchased */}
                        {isAuthenticated() && hasPurchased ? (
                            <div className="review-form mb-5 p-4 rounded-4" style={{
                                background: 'rgba(255,255,255,0.5)'
                            }}>
                                <h5 className="mb-3" style={{ color: '#003399' }}>
                                    <i className="fas fa-pen me-2"></i>Viết đánh giá của bạn
                                </h5>

                                {reviewError && (
                                    <div className="alert alert-danger" role="alert">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        {reviewError}
                                    </div>
                                )}

                                {reviewSuccess && (
                                    <div className="alert alert-success" role="alert">
                                        <i className="fas fa-check-circle me-2"></i>
                                        {reviewSuccess}
                                    </div>
                                )}

                                <form onSubmit={handleSubmitReview}>
                                    <div className="mb-3">
                                        <label className="form-label" style={{ color: '#003399' }}>
                                            Đánh giá:
                                        </label>
                                        <div className="star-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i
                                                    key={star}
                                                    className={`fas fa-star fa-2x me-1 ${star <= newReview.rating ? 'text-warning' : 'text-muted'}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                ></i>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" style={{ color: '#003399' }}>
                                            Nhận xét của bạn:
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={reviewLoading}
                                    >
                                        {reviewLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-2"></i>Gửi đánh giá
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : isAuthenticated() && !hasPurchased ? (
                            <div className="alert alert-info mb-5">
                                <i className="fas fa-info-circle me-2"></i>
                                Bạn cần mua sản phẩm này để có thể đánh giá.
                            </div>
                        ) : (
                            <div className="alert alert-info mb-5">
                                <i className="fas fa-info-circle me-2"></i>
                                Vui lòng <Link to="/login" style={{ color: '#003399', fontWeight: '600' }}>đăng nhập</Link> và mua sản phẩm này để đánh giá.
                            </div>
                        )}

                        {/* Reviews List */}
                        <div className="reviews-list">
                            <h5 className="mb-3" style={{ color: '#003399' }}>
                                ({reviews.length}) Đánh giá
                            </h5>

                            {reviews.length === 0 ? (
                                <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id} className="review-item mb-3 p-3 rounded-3" style={{
                                        background: 'rgba(255,255,255,0.5)'
                                    }}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <strong style={{ color: '#003399' }}>{review.userName}</strong>
                                                <div className="star-rating ms-2 d-inline">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <small className="text-muted">
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </small>
                                        </div>
                                        <p className="mb-0">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
