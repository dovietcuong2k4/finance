import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken } from '@/utils/auth'
import { createAdminClient } from '@/utils/supabase/admin'
import { updateCategoryBudgets } from '@/app/auth/actions'
import Link from 'next/link'
import { Wallet, ArrowLeft, ChevronLeft, Save } from 'lucide-react'
import ErrorToast from '@/components/error-toast'
import FormattedAmountInput from '@/components/formatted-amount-input'
import { CATEGORIES } from '@/constants/categories'

export default async function BudgetsPage(props: { searchParams: Promise<{ error?: string, success?: string }> }) {
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
    .select('metadata')
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

      <div className="max-w-3xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Desktop Navigation */}
        <Link href="/account" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} />
          Quay lại Hồ sơ
        </Link>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 mb-6 pt-1">
          <Link href="/account" className="p-1 -ml-1 text-foreground transition-colors shrink-0">
            <ChevronLeft size={28} strokeWidth={2.5} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Định chi Túi tiền</h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-aura-indigo shadow-sm border border-indigo-100 shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Định chi cho từng Túi tiền</h1>
            <p className="text-muted-foreground mt-1 text-sm">Thiết lập số tiền định chi (ngân sách) cho từng danh mục chi tiêu riêng biệt</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bento-card p-6 md:p-8 bg-white shadow-xl shadow-black/2 border border-border">
          <div className="mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cấu hình chi tiết ngân sách</h3>
            <p className="text-xs text-muted-foreground mt-1">Để trống mục nếu bạn không muốn thiết lập giới hạn chi tiêu (ngân sách) cho Túi tiền đó.</p>
          </div>
          
          <form action={updateCategoryBudgets} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {CATEGORIES.filter(c => c.type === 'expense').map(c => {
                const Icon = c.icon;
                const currentLimit = user.metadata?.categoryLimits?.[c.value];
                return (
                  <div key={c.value} className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1.5" htmlFor={`budget_${c.value}`}>
                      <span className={`p-1.5 rounded-lg ${c.className} inline-flex items-center justify-center shrink-0`}>
                        <Icon size={14} />
                      </span>
                      {c.label} (VNĐ)
                    </label>
                    <FormattedAmountInput
                      className="w-full minimal-input bg-slate-50/50"
                      name={`budget_${c.value}`}
                      defaultValue={currentLimit ? new Intl.NumberFormat('vi-VN').format(currentLimit) : ''}
                      placeholder="Không giới hạn"
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button className="flex items-center gap-2 bg-slate-900 text-white h-11 px-6 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] w-full sm:w-auto justify-center">
                <Save size={16} />
                Lưu ngân sách Túi tiền
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
