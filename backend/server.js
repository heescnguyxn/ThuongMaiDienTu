const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');
const Review = require('./models/Review');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB - Sử dụng MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://longnguyen:yt4R1aroqDSyBoQz@cluster0.6cwjeyr.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ==================== USER ROUTES ====================

// Đăng ký
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Tạo user mới
        const newUser = new User({
            username,
            email,
            password,
            fullName,
            phone: '',
            address: '',
            city: ''
        });

        await newUser.save();

        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.status(201).json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Đăng nhập
app.post('/api/auth/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        // Tìm user theo email HOẶC username
        const user = await User.findOne({
            $or: [
                { email: login },
                { username: login }
            ],
            password: password
        });

        if (!user) {
            return res.status(401).json({ message: 'Tên đăng nhập/Email hoặc mật khẩu không đúng' });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin user hiện tại
app.get('/api/auth/me', async (req, res) => {
    try {
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cập nhật thông tin user
app.put('/api/auth/profile', async (req, res) => {
    try {
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==================== PRODUCT ROUTES ====================

// Lấy tất cả sản phẩm
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tạo sản phẩm mới
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật sản phẩm
app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==================== ORDER ROUTES ====================

// Lấy tất cả đơn hàng
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy đơn hàng của user
app.get('/api/orders/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy đơn hàng theo ID
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tạo đơn hàng mới
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order({
            customerId: req.body.customerId,
            customerName: req.body.customerName,
            customerEmail: req.body.customerEmail,
            customerPhone: req.body.customerPhone,
            customerAddress: req.body.customerAddress,
            products: req.body.products,
            totalAmount: req.body.totalAmount,
            status: 'pending'
        });

        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật trạng thái đơn hàng
app.put('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa đơn hàng
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Kiểm tra user đã mua sản phẩm chưa
app.get('/api/orders/check-purchase/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const hasPurchased = await Order.exists({
            customerId: userId,
            status: { $ne: 'cancelled' },
            'products.productId': productId
        });

        res.json({ hasPurchased: !!hasPurchased });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==================== REVIEW ROUTES ====================

// Lấy đánh giá của sản phẩm
app.get('/api/reviews/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('userId', 'fullName')
            .sort({ createdAt: -1 });

        const reviewsWithUser = reviews.map(review => ({
            _id: review._id,
            userId: review.userId._id,
            userName: review.userId.fullName,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
        }));

        res.json(reviewsWithUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Thêm đánh giá sản phẩm
app.post('/api/reviews', async (req, res) => {
    try {
        const { userId, productId, rating, comment } = req.body;

        // Kiểm tra user đã mua sản phẩm chưa
        const hasPurchased = await Order.exists({
            customerId: userId,
            status: { $ne: 'cancelled' },
            'products.productId': productId
        });

        if (!hasPurchased) {
            return res.status(403).json({ message: 'Bạn cần mua sản phẩm này trước khi đánh giá' });
        }

        // Kiểm tra user đã đánh giá chưa
        const existingReview = await Review.findOne({ userId, productId });
        if (existingReview) {
            return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        const review = new Review({
            userId,
            productId,
            rating,
            comment
        });

        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route test
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Online Shop API with MongoDB' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
