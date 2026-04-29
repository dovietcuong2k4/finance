# Aura Finance - Lộ trình phát triển (Project Plan)

Dưới đây là kế hoạch chi tiết để phát triển Aura Finance từ bản mẫu (Prototype) thành một ứng dụng quản lý tài chính cá nhân hoàn chỉnh.

## Giai đoạn 1: Nền tảng & Giao diện (Hoàn thành)
- [x] Khởi tạo dự án Next.js 14 với Tailwind CSS.
- [x] Thiết lập hệ thống thiết kế Modern Corporate UI.
- [x] Xây dựng Dashboard tổng quan với các KPI và biểu đồ mẫu.
- [x] Thiết kế khu vực Cố vấn AI (Mockup).

## Giai đoạn 2: Quản lý Dữ liệu & Tính năng cốt lõi
- [ ] **Hệ thống giao dịch:**
    - Triển khai Form thêm giao dịch (Thu nhập/Chi tiêu).
    - Lưu trữ dữ liệu vào Database (Supabase hoặc MongoDB).
    - Tính năng lọc, tìm kiếm và phân loại giao dịch.
- [ ] **Quản lý Ngân sách:**
    - Thiết lập hạn mức chi tiêu cho từng danh mục (Ăn uống, Giải trí...).
    - Hệ thống cảnh báo khi chi tiêu vượt ngưỡng.
- [ ] **Mục tiêu Tiết kiệm:**
    - Tạo và theo dõi tiến độ của các mục tiêu (Mua xe, Du lịch...).

## Giai đoạn 3: Tích hợp AI Thực tế
- [ ] **Kết nối Gemini API:**
    - Gửi dữ liệu chi tiêu ẩn danh cho AI để phân tích.
    - Xây dựng Chatbot cố vấn tài chính thời gian thực.
- [ ] **Insight Thông minh:**
    - Tự động phát hiện các khoản chi tiêu bất thường.
    - Dự báo số dư cuối tháng dựa trên thói quen hiện tại.

## Giai đoạn 4: Tính năng Nâng cao & Bảo mật
- [ ] **Xác thực người dùng:** Đăng nhập qua Google/Email (NextAuth.js).
- [ ] **Xuất báo cáo:** Hỗ trợ xuất dữ liệu ra file PDF/Excel hàng tháng.
- [ ] **Đa tiền tệ:** Hỗ trợ quản lý bằng nhiều loại tiền tệ khác nhau.
- [ ] **Dark Mode hoàn chỉnh:** Tinh chỉnh bảng màu cho trải nghiệm đêm tốt nhất.

## Giai đoạn 5: Tối ưu & Triển khai
- [ ] Kiểm thử hiệu năng và tối ưu hóa tốc độ tải trang.
- [ ] Triển khai lên Vercel hoặc các nền tảng Cloud.
- [ ] Thiết lập hệ thống sao lưu dữ liệu tự động.

---
*Ghi chú: Lộ trình này có thể thay đổi tùy theo phản hồi của người dùng và ưu tiên tính năng.*
