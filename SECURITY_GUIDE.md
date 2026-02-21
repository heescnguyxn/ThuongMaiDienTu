# 🔒 Hướng Dẫn Bảo Mật Git

## Quy trình push an toàn

### 1. Trước khi add
```bash
git status
# Kiểm tra không có file nhạy cảm (password, API key, .env)
```

### 2. Nếu có file nhạy cảm
```bash
# Không add file đó
git add file_an_toan.js      # Chỉ add từng file cụ thể

# Hoặc bỏ file đã add nhầm
git reset HEAD .env
```

### 3. Kiểm tra lại trước commit
```bash
git diff --cached            # Xem nội dung sẽ commit
```

### 4. Commit và push
```bash
git commit -m "Mô tả rõ ràng"
git push origin main
```

## ⚠️ File KHÔNG được push lên Git

- `.env` - Chứa password, API key
- `node_modules/` - Thư viện (cài lại được)
- File chứa: password, secret key, token, database URI

## 🛠️ Cách khôi phục nếu đã push nhầm

```bash
# 1. Xóa file khỏi Git nhưng giữ lại local
git rm --cached file_nhay_cam

# 2. Thêm vào .gitignore
echo "file_nhay_cam" >> .gitignore

# 3. Commit và push lại
git commit -m "Remove sensitive file"
git push origin main

# 4. Xóa lịch sử (nếu cần) - CẢNH BÁO: Mất commit cũ
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch file_nhay_cam' HEAD
```

## ✅ Checklist trước mỗi push

- [ ] Kiểm tra `git status` không có file .env
- [ ] Kiểm tra `git diff` không có password/API key
- [ ] Đã thêm file nhạy cảm vào .gitignore
- [ ] Commit message rõ ràng
