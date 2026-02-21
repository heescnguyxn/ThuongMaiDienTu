const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Dữ liệu mẫu sản phẩm
const products = [
    {
        name: 'iPhone 15 Pro Max',
        description: 'Điện thoại thông minh cao cấp với chip A17 Pro, màn hình Super Retina XDR 6.7 inch',
        price: 34990000,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-titanium-black-ti-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692875661171',
        category: 'Điện thoại',
        stock: 50
    },
    {
        name: 'MacBook Pro 14 inch',
        description: 'Laptop chuyên nghiệp với chip M3 Pro, RAM 18GB, SSD 512GB',
        price: 49990000,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-pro-14-midnight-202310?wid=4536&hei=2612&fmt=jpeg&qlt=80&.v=1696650490513',
        category: 'Laptop',
        stock: 30
    },
    {
        name: 'AirPods Pro 2',
        description: 'Tai nghe chống ồn chủ động, chip H2, thời lượng pin 6 giờ',
        price: 6990000,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-gen-hero-202209?wid=340&hei=340&fmt=jpeg-alpha-qlt=80&.v=1663626083100',
        category: 'Tai nghe',
        stock: 100
    },
    {
        name: 'iPad Pro 12.9 inch',
        description: 'Tablet cao cấp với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil',
        price: 27990000,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-model-select-gallery-2-202210?wid=3920&hei=2612&fmt=jpeg-qlt=80&.v=1664996081525',
        category: 'Tablet',
        stock: 40
    },
    {
        name: 'Apple Watch Series 9',
        description: 'Đồng hồ thông minh với chip S9, màn hình Always-On Retina',
        price: 9990000,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-series-9-cellular-nc-cellular-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692875661171',
        category: 'Đồng hồ',
        stock: 60
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Điện thoại Android cao cấp với chip Snapdragon 8 Gen 3, camera 200MP',
        price: 32990000,
        image: 'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-sm-s928-showroom-539-533 static-533.jpg?$512_BUGET_JPG$',
        category: 'Điện thoại',
        stock: 45
    },
    {
        name: 'Sony WH-1000XM5',
        description: 'Tai nghe chống ồn cao cấp, thời lượng pin 30 giờ',
        price: 7990000,
        image: 'https://www.sony.com/image/sonycaruen_wh1000xm5_black_001?$desktop$',
        category: 'Tai nghe',
        stock: 75
    },
    {
        name: 'Nike Air Max 270',
        description: 'Giày thể thao với công nghệ Air Max, thiết kế hiện đại',
        price: 4990000,
        image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/air-max-270-mens-shoes-HzLCHn.png',
        category: 'Giày',
        stock: 80
    }
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://longnguyen:yt4R1aroqDSyBoQz@cluster0.6cwjeyr.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        try {
            // Xóa dữ liệu cũ và thêm dữ liệu mới
            await Product.deleteMany({});
            await Product.insertMany(products);

            console.log('✅ Products seeded successfully');
            console.log(`📦 Added ${products.length} products`);
        } catch (err) {
            console.error('❌ Error seeding products:', err);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
