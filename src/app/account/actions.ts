'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { verifyToken } from '@/utils/auth'

export async function resetData() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return redirect('/login')

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) return redirect('/login')

  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', payload.userId)

  if (error) {
    return redirect(`/account?error=${encodeURIComponent('Có lỗi xảy ra khi xóa dữ liệu')}`)
  }

  revalidatePath('/', 'layout')
  redirect(`/account?success=${encodeURIComponent('Toàn bộ dữ liệu giao dịch đã được xoá thành công')}`)
}

export async function deleteAccount() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return redirect('/login')

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) return redirect('/login')

  const supabase = createAdminClient()
  
  await supabase
    .from('transactions')
    .delete()
    .eq('user_id', payload.userId)

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', payload.userId)

  if (error) {
    return redirect(`/account?error=${encodeURIComponent('Có lỗi xảy ra khi xóa tài khoản')}`)
  }

  cookieStore.delete('auth_token')
  revalidatePath('/', 'layout')
  redirect(`/login?message=${encodeURIComponent('Tài khoản của bạn đã được xoá vĩnh viễn.')}`)
}
