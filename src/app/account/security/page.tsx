import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken } from '@/utils/auth'
import { changePassword } from '@/app/auth/actions'
import Link from 'next/link'
import { Shield, Key, ArrowLeft, ChevronLeft, Save } from 'lucide-react'
import ErrorToast from '@/components/error-toast'

export default async function SecurityPage(props: { searchParams: Promise<{ error?: string, success?: string }> }) {
  const searchParams = await props.searchParams
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return redirect('/login')
  }

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) {
    return redirect('/login')
  }

  return (
    <div className="flex-1 bg-[#fdfdfe] p-4 lg:p-8 relative flex flex-col">
      <ErrorToast message={searchParams?.error} type="error" />
      <ErrorToast message={searchParams?.success} type="success" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-aura-violet rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-aura-indigo rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Desktop Navigation */}
        <Link href="/account" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} />
          Quay lại Hồ sơ
        </Link>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 mb-6 pt-6">
          <Link href="/account" className="p-1 -ml-1 text-foreground transition-colors shrink-0">
            <ChevronLeft size={28} strokeWidth={2.5} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Bảo mật</h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100 shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Bảo mật</h1>
            <p className="text-muted-foreground mt-1 text-sm">Cập nhật mật khẩu để bảo vệ tài khoản</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bento-card p-6 md:p-8 bg-white shadow-xl shadow-black/2 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
              <Key size={16} />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Đổi mật khẩu</h3>
          </div>
          
          <form action={changePassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="oldPassword">
                Mật khẩu hiện tại
              </label>
              <input
                className="w-full minimal-input bg-slate-50/50"
                name="oldPassword"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="newPassword">
                Mật khẩu mới
              </label>
              <input
                className="w-full minimal-input bg-slate-50/50"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="confirmPassword">
                Xác nhận mật khẩu mới
              </label>
              <input
                className="w-full minimal-input bg-slate-50/50"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <button className="flex items-center gap-2 bg-slate-900 text-white h-11 px-6 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] w-full sm:w-auto justify-center">
                <Save size={16} />
                Lưu mật khẩu mới
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
