import Link from 'next/link'
import { signUp } from '@/app/auth/actions'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default async function SignupPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfe] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-aura-violet rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-aura-indigo rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-8">

        <div className="bento-card p-8 md:p-10 border border-border bg-white shadow-2xl shadow-black/[0.02]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Bắt đầu cùng Aura</h1>
            <p className="text-muted-foreground text-sm mt-2 text-center">
              Trải nghiệm quản lý tài chính thế hệ mới với sức mạnh AI
            </p>
          </div>

          <form action={signUp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="email">
                Địa chỉ Email
              </label>
              <input
                className="w-full minimal-input bg-slate-50/50"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="password">
                Mật khẩu
              </label>
              <input
                className="w-full minimal-input bg-slate-50/50"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-muted-foreground text-center mb-4 leading-relaxed">
                Bằng cách đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
              </p>
              <button className="w-full bg-primary text-white h-11 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 active:scale-[0.98]">
                Tạo tài khoản miễn phí
              </button>
            </div>
            
            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-aura-indigo font-semibold hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>

            {searchParams?.message && (
              <div className="mt-6 p-4 bg-amber-50/50 border border-amber-100 rounded-xl animate-in fade-in zoom-in duration-300">
                <p className="text-xs font-medium text-amber-800 text-center">
                  {searchParams.message}
                </p>
              </div>
            )}
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-muted-foreground/60">
          © 2026 Aura Finance. All rights reserved.
        </p>
      </div>
    </div>
  )
}
