import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken } from '@/utils/auth'
import { createAdminClient } from '@/utils/supabase/admin'
import { signOut, updateProfile } from '@/app/auth/actions'
import Link from 'next/link'
import { User, Shield, Activity, LogOut, Settings, Save, Mail, Key, Crown, AlertTriangle } from 'lucide-react'
import ErrorToast from '@/components/error-toast'
import AccountDangerActions from './account-danger-actions'
import Image from 'next/image'

export default async function AccountPage(props: { searchParams: Promise<{ error?: string, success?: string }> }) {
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

  const supabase = createAdminClient()
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', payload.userId)
    .single()

  if (!user) {
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

      <div className="max-w-none w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Hồ sơ cá nhân</h1>
            <p className="text-muted-foreground mt-1 text-sm">Quản lý thông tin và bảo mật tài khoản Aura của bạn</p>
          </div>
          <form action={signOut}>
            <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-red-600 border border-red-100 font-medium py-2 px-4 rounded-xl transition-all shadow-sm active:scale-[0.98]">
              <LogOut size={16} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </form>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Card (Large) */}
          <div className="bento-card p-6 md:p-8 col-span-1 md:col-span-2 bg-white shadow-xl shadow-black/2 border border-border flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden relative shadow-lg shadow-primary/10 bg-slate-100 shrink-0 flex items-center justify-center border-4 border-white">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt="Avatar" fill className="object-cover" />
              ) : (
                <User size={48} className="text-slate-300" />
              )}
            </div>
            <div className="flex-1 w-full text-center sm:text-left pt-2">
              <h2 className="text-2xl font-bold text-slate-800">{user.full_name || 'Người dùng Aura'}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mt-2 bg-slate-50 w-fit sm:mx-0 mx-auto px-3 py-1.5 rounded-lg border border-slate-100">
                <Mail size={14} />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-100">
                  Hoạt động
                </span>
                <span className="px-2.5 py-1 bg-indigo-50 text-aura-indigo text-xs font-semibold rounded-md border border-indigo-100">
                  Thành viên chuẩn
                </span>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bento-card p-6 bg-white shadow-xl shadow-black/2 border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <Shield size={16} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Bảo mật</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">ID Tài khoản (Mã nội bộ)</p>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Key size={14} className="text-slate-400 shrink-0" />
                <p className="font-mono text-xs text-slate-600 truncate">{user.id}</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/account/security" className="text-xs font-semibold text-aura-indigo hover:underline flex items-center gap-1">
                Đổi mật khẩu &rarr;
              </Link>
            </div>
          </div>

          {/* Settings Form Card */}
          <div className="bento-card p-6 md:p-8 col-span-1 md:col-span-2 bg-white shadow-xl shadow-black/2 border border-border">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Settings size={16} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cập nhật thông tin</h3>
             </div>
             
             <form action={updateProfile} className="space-y-4">
               <div className="space-y-2">
                 <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="fullName">
                   Họ và tên
                 </label>
                 <input
                   className="w-full minimal-input bg-slate-50/50"
                   name="fullName"
                   type="text"
                   defaultValue={user.full_name || ''}
                   placeholder="Nhập họ và tên của bạn"
                 />
               </div>
               
               <div className="pt-4 flex justify-end">
                 <button className="flex items-center gap-2 bg-slate-900 text-white h-10 px-6 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                   <Save size={16} />
                   Lưu thay đổi
                 </button>
               </div>
             </form>
          </div>

          {/* Activity Card */}
          <div className="bento-card p-6 bg-white shadow-xl shadow-black/2 border border-border flex flex-col justify-between">
             <div>
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <Activity size={16} />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hoạt động</h3>
               </div>
               <div className="space-y-4">
                 <div>
                   <p className="text-[10px] uppercase text-muted-foreground mb-1 font-medium">Ngày tham gia</p>
                   <p className="font-medium text-sm text-foreground">
                     {new Date(user.created_at).toLocaleDateString('vi-VN', {
                       year: 'numeric', month: 'long', day: 'numeric'
                     })}
                   </p>
                 </div>
                 <div>
                   <p className="text-[10px] uppercase text-muted-foreground mb-1 font-medium">Cập nhật lần cuối</p>
                   <p className="font-medium text-sm text-foreground">
                     {new Date(user.updated_at || user.created_at).toLocaleDateString('vi-VN', {
                       year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                     })}
                   </p>
                 </div>
               </div>
             </div>
          </div>
          
          {/* Subscription Card */}
          <div className="bento-card p-6 bg-white shadow-xl shadow-black/2 border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                  <Crown size={16} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gói cước</h3>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Gói hiện tại</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold text-slate-800">Miễn phí</p>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-md uppercase">Đang dùng</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Tài khoản của bạn được sử dụng đầy đủ các tính năng cơ bản của Aura Finance.
              </p>
            </div>
          </div>

          {/* Data & Privacy Card */}
          <div className="bento-card p-6 md:p-8 col-span-1 md:col-span-2 bg-white shadow-xl shadow-black/2 border border-red-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <AlertTriangle size={16} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-red-500">Quản lý Dữ liệu & Quyền riêng tư</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Những hành động dưới đây không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực hiện.
              </p>
              
              <AccountDangerActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
