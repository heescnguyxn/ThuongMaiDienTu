const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Đăng ký
router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
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
router.get('/me', async (req, res) => {
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
router.put('/profile', async (req, res) => {
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

module.exports = router;
