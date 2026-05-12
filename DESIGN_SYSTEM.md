# Aura Moni - Design System & UI Guidelines

Tài liệu này đóng vai trò như một cẩm nang thiết kế (Design System) dành cho các Agent AI hoặc các lập trình viên khi tiếp tục phát triển ứng dụng Aura Moni. Tuân thủ nghiêm ngặt các quy tắc dưới đây để đảm bảo ứng dụng luôn giữ được vẻ đẹp hiện đại, cao cấp và thống nhất.

## 1. Phong cách thiết kế chung (Aesthetics)
- **Cảm hứng:** Bảng điều khiển tài chính cao cấp (Premium Financial Dashboard), Apple Design, Modern Fintech.
- **Bố cục chính:** **Bento Grid** (Các thẻ/card bo tròn, sắp xếp linh hoạt theo dạng lưới).
- **Màu sắc chủ đạo (Tokens):**
  - Nền (Background): Sáng, hơi ngả xám nhạt tinh tế (`bg-[#fdfdfe]`).
  - Thẻ (Card): Trắng tinh (`bg-white`), viền mỏng (`border-border`), có đổ bóng siêu nhẹ (`shadow-xl shadow-black/2`).
  - Điểm nhấn (Accents): Tím Indigo (`var(--aura-indigo)` / `#6366f1`) và Tím Violet (`var(--aura-violet)` / `#8b5cf6`).
  - Trạng thái: Xanh lá (`emerald-500` / `green-500`) cho Thu nhập, Đỏ (`red-500`) cho Chi tiêu, Cam (`orange-500`) cho Bảo mật.
- **Kiểu chữ (Typography):**
  - Font: **Inter** (tự động load qua Next.js).
  - Tiêu đề (Headings): Dùng `tracking-tight` (chữ khít lại) và `font-bold` để tạo cảm giác hiện đại.
  - Nhãn (Labels): Thường dùng `text-xs font-semibold uppercase tracking-wider text-muted-foreground` để làm các tiêu đề phụ (nhỏ, in hoa, thưa chữ).
- **Bo góc (Border Radius):** Lớn. Các thẻ dùng `rounded-xl`, `rounded-2xl`, nút bấm dùng `rounded-xl` hoặc `rounded-lg`.
- **Hiệu ứng (Hover & Animations):**
  - Các thẻ tương tác: Nổi nhẹ lên khi hover (`hover:-translate-y-[2px] transition-all duration-300`).
  - Đổi màu viền thẻ khi hover (ví dụ: `hover:border-aura-indigo`).
  - Tránh các hiệu ứng chuyển động rườm rà, tập trung vào sự mượt mà (smoothness) với `duration-200` đến `duration-300`.

## 2. Quy tắc Responsive & Giao diện Mobile (Webview)
Hệ thống được thiết kế theo hướng **Mobile-First**, đặc biệt tối ưu cho việc nhúng vào WebView của Native App.

### Khung sườn (Layout)
- **Desktop (`md:flex`):** Sử dụng `Sidebar` cố định bên trái (`w-64`). Nội dung bên phải tự động trải rộng.
- **Mobile (`md:hidden`):** 
  - Ẩn hoàn toàn Sidebar.
  - Sử dụng thanh **Bottom Navigation** (`components/bottom-nav.tsx`) ghim ở đáy màn hình.
  - Thẻ `<main>` được cấu hình thêm vùng đệm đáy: `pb-[calc(env(safe-area-inset-bottom)+4rem)]` để không bị Bottom Nav che khuất và tránh "tai thỏ/home indicator" của iPhone.

### Thanh tiêu đề Mobile (Mobile Headers)
- Ẩn các nút "Quay lại" dạng text (như `<- Quay lại`).
- Thiết kế header trên mobile giống Native App: Một hàng ngang (`flex items-center`) chứa biểu tượng mũi tên quay lại (`ChevronLeft size={28} strokeWidth={2.5}`) nằm ngay sát Tiêu đề. Không dùng background tròn đằng sau mũi tên.
- **Viewport:** Đã chặn phóng to (zoom) trên mobile (`user-scalable=0`).
- **Thanh cuộn (Scrollbar):** Bị ẩn hoàn toàn trên màn hình nhỏ dưới `768px` bằng CSS để giao diện trông giống Native App.

## 3. Các Component cốt lõi (Core Components)

### Thẻ Bento (Bento Card)
- Sử dụng class `.bento-card` đã được định nghĩa trong `globals.css`.
- Hoặc dùng utility classes: `p-6 bg-white shadow-xl shadow-black/2 border border-border flex flex-col`.

### Nút Submit (Submit Button)
- Khi gọi Server Actions, **bắt buộc** dùng `SubmitButton` (`components/submit-button.tsx`) thay vì thẻ `<button>` thường.
- Lý do: Component này đã tích hợp hook `useFormStatus` giúp tự động hiển thị trạng thái `Đang xử lý...`, khóa nút và làm mờ (opacity) để tránh user click nhiều lần.

### Thông báo lỗi / thành công (Toasts & Modals)
- **Toast:** Dùng thư viện `react-hot-toast` (`toast.success()`, `toast.error()`).
- **Lỗi từ Server:** Dùng component `ErrorToast` để bắt các param `?error=` hoặc `?success=` từ URL.
- **Xác nhận hành động nguy hiểm:** (Xoá dữ liệu, Xóa tài khoản, Xoá giao dịch) -> Phải tạo Client Component và gọi `Modal.useModal()` của **Ant Design** (antd) để hiển thị hộp thoại xác nhận. *Lưu ý: Luôn dùng thuộc tính `mask: { closable: true }` cho Modal, không dùng `maskClosable` (đã deprecated).*

### Trạng thái chờ (Skeleton Loading)
- **Bắt buộc** có file `loading.tsx` ở các route chính (như `/`, `/transactions`, `/account`).
- File `loading.tsx` cung cấp giao diện khung xương (skeleton) sử dụng class `animate-pulse` để báo hiệu dữ liệu đang tải.
- Điều này giúp chuyển trang (Navigation) diễn ra ngay lập tức mà không bị đơ giao diện khi Server Component đang chờ lấy dữ liệu (data fetching).

## 4. Kiến trúc Server Actions & Data Fetching
- Khởi tạo Supabase Admin Client: **Bắt buộc** dùng hàm `createAdminClient()` import từ `@/utils/supabase/admin`. **Tuyệt đối không** import `@supabase/supabase-js` và khởi tạo trực tiếp trong các file action.
- Hành động gây thay đổi dữ liệu (Mutations): Đặt trong file `actions.ts` cùng cấp với thư mục, sử dụng chuỗi `'use server'`.
- Sau khi mutate, dùng `revalidatePath()` và `redirect()` để trả về kết quả.
- Khi gọi Server Action từ một Client Component (`onClick`), hãy bọc lời gọi hàm trong `startTransition` để Next.js xử lý việc chuyển trang mượt mà không bị treo UI.

---
*Bất kỳ AI Agent nào khi đọc file này cần tuân thủ 100% các nguyên tắc đã được thiết lập để giữ tính nhất quán cho toàn bộ dự án.*
