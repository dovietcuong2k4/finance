import { Settings, Construction, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-1 bg-[#fdfdfe] p-4 lg:p-8 relative flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-aura-violet rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-aura-indigo rounded-full blur-[120px]" />
      </div>

      <div className="max-w-none w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-6 md:pt-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Cài đặt</h1>
          <p className="text-muted-foreground mt-1 text-sm">Tùy chỉnh trải nghiệm Aura Finance theo cách của bạn</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bento-card p-8 md:p-12 bg-white shadow-xl shadow-black/2 border border-border flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border border-indigo-100/50 shadow-lg shadow-indigo-500/5">
              <Construction className="w-10 h-10 text-aura-indigo" />
            </div>
            {/* Floating sparkle */}
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-2">
            Đang trong quá trình phát triển
          </h2>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-8">
            Chúng tôi đang xây dựng trang Cài đặt với nhiều tuỳ chọn cá nhân hoá hấp dẫn. Tính năng này sẽ sớm được ra mắt trong các phiên bản tiếp theo.
          </p>

          {/* Feature preview chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              'Giao diện sáng / tối',
              'Ngôn ngữ',
              'Đơn vị tiền tệ',
              'Thông báo',
              'Sao lưu dữ liệu',
              'Xuất báo cáo',
            ].map((feature) => (
              <span
                key={feature}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50 rounded-lg border border-slate-100"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Version info */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            <Settings className="w-3.5 h-3.5" />
            <span>Aura Finance v2.0.4 — Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
