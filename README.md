# 🛒 Online Shop - Website Bán Hàng Trực Tuyến

## 🚀 Công nghệ sử dụng

- **Frontend:** React, HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB (MongoDB Atlas)

## 📁 Cấu trúc dự án

```
tuhocjs/
├── backend/                 # Backend API
│   ├── models/              # MongoDB Models
│   │   ├── Product.js      # Model sản phẩm
│   │   ├── Order.js        # Model đơn hàng
│   │   ├── User.js         # Model người dùng
│   │   └── Review.js       # Model đánh giá
│   ├── .env               # Cấu hình MongoDB
│   ├── server.js          # Main server
│   ├── seed.js            # Thêm dữ liệu mẫu
│   └── package.json
│
└── frontend/               # React Frontend
    ├── src/
    │   ├── pages/          # Các trang web
    │   ├── components/     # Components
    │   └── context/        # Auth Context
    └── package.json
```

## ⚙️ Cài đặt và Chạy

### 1. Cài đặt Backend

```
bash
cd backend
npm install
```

### 2. Cấu hình MongoDB

File `.env` đã được cấu hình sẵn với MongoDB Atlas của bạn:

```
PORT=5000
MONGODB_URI=mongodb+srv://longnguyen:yt4R1aroqDSyBoQz@cluster0.6cwjeyr.mongodb.net/?appName=Cluster0
```

### 3. Chạy Backend

```
bash
# Terminal 1: Chạy server
npm start
```

### 4. Thêm dữ liệu mẫu (tùy chọn)

```
bash
# Terminal 2: Seed data
node seed.js
```

### 5. Chạy Frontend

```
bash
# Terminal 2
cd ../frontend
npm install
npm start
```

## 🌐 Truy cập ứng dụng

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user
- `PUT /api/auth/profile` - Cập nhật profile

### Products
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Orders
- `GET /api/orders` - Lấy tất cả đơn hàng
- `GET /api/orders/user/:userId` - Lấy đơn hàng của user
- `GET /api/orders/:id` - Lấy đơn hàng theo ID
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng
- `DELETE /api/orders/:id` - Xóa đơn hàng
- `GET /api/orders/check-purchase/:userId/:productId` - Kiểm tra user đã mua sản phẩm chưa

### Reviews
- `GET /api/reviews/product/:productId` - Lấy đánh giá của sản phẩm
- `POST /api/reviews` - Thêm đánh giá (cần mua sản phẩm)

## ✨ Tính năng

1. **Trang chủ** - Hiển thị sản phẩm nổi bật
2. **Danh sách sản phẩm** - Xem tất cả sản phẩm
3. **Chi tiết sản phẩm** - Xem thông tin, thêm vào giỏ, mua ngay
4. **Giỏ hàng** - Quản lý sản phẩm đã chọn
5. **Thanh toán** - Đặt hàng với thông tin tự động từ profile
6. **Tài khoản** - Quản lý thông tin cá nhân, địa chỉ giao hàng
7. **Theo dõi đơn hàng** - Xem trạng thái đơn hàng
8. **Đánh giá sản phẩm** - Đánh giá sau khi mua hàng

## 🔧 Database Schema

### User
```
javascript
{
  username: String,
  email: String,
  password: String,
  fullName: String,
  phone: String,
  address: String,
  city: String,
  createdAt: Date
}
```

### Product
```
javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  createdAt: Date
}
```

### Order
```
javascript
{
  customerId: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAddress: String,
  products: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  status: String,
  createdAt: Date
}
```

### Review
```
javascript
{
  userId: ObjectId,
  productId: String,
  rating: Number,
  comment: String,
  createdAt: Date
}
