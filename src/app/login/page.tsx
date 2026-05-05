import Link from 'next/link'
import { signIn } from '@/app/auth/actions'
import { Shield, ArrowLeft } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfe] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-aura-indigo rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-aura-violet rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-8">

        <div className="bento-card p-8 md:p-10 border border-border bg-white shadow-2xl shadow-black/[0.02]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Chào mừng trở lại</h1>
            <p className="text-muted-foreground text-sm mt-2 text-center">
              Nhập thông tin để truy cập vào bảng điều khiển Aura của bạn
            </p>
          </div>

          <form action={signIn} className="space-y-4">
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                  Mật khẩu
                </label>
              </div>
              <input
                className="w-full minimal-input bg-slate-50/50"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <button className="w-full bg-primary text-white h-11 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 active:scale-[0.98] mt-2">
              Đăng nhập
            </button>
            
            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Chưa có tài khoản?{' '}
                <Link href="/signup" className="text-aura-indigo font-semibold hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {searchParams?.message && (
              <div className="mt-6 p-4 bg-red-50/50 border border-red-100 rounded-xl animate-in fade-in zoom-in duration-300">
                <p className="text-xs font-medium text-red-600 text-center">
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
