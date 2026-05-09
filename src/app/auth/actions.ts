'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { signToken, verifyToken } from '@/utils/auth'

export async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  
  if (!token) return null
  
  const payload = await verifyToken(token)
  if (!payload || !payload.userId) return null
  
  const supabase = createAdminClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, full_name, avatar_url, created_at, metadata')
    .eq('id', payload.userId)
    .single()
    
  if (error || !user) return null
  
  return user
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createAdminClient()

  // Find user in public.users
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return redirect(`/login?error=${encodeURIComponent('Email hoặc mật khẩu không chính xác')}`)
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return redirect(`/login?error=${encodeURIComponent('Email hoặc mật khẩu không chính xác')}`)
  }

  // Create token
  const token = await signToken({ userId: user.id, email: user.email })
  
  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createAdminClient()

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  // Insert user
  const { data: user, error } = await supabase
    .from('users')
    .insert([{ email, password_hash: passwordHash }])
    .select()
    .single()

  if (error) {
    let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.'
    if (error.code === '23505') {
      errorMessage = 'Email này đã được sử dụng.'
    } else {
      errorMessage = error.message
    }
    return redirect(`/signup?error=${encodeURIComponent(errorMessage)}`)
  }

  // Create token
  const token = await signToken({ userId: user.id, email: user.email })
  
  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function updateProfile(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const parseLimit = (val: string) => {
    if (!val) return null;
    const cleanVal = val.replace(/\D/g, '');
    return cleanVal ? Number(cleanVal) : null;
  }

  const dailyLimit = parseLimit(formData.get('dailyLimit') as string)
  const monthlyLimit = parseLimit(formData.get('monthlyLimit') as string)

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

  // Fetch existing metadata to preserve other settings
  const { data: user } = await supabase.from('users').select('metadata').eq('id', payload.userId).single()
  const existingMetadata = user?.metadata || {}
  const newMetadata = {
    ...existingMetadata,
    dailyLimit,
    monthlyLimit
  }

  const { error } = await supabase
    .from('users')
    .update({ 
      full_name: fullName, 
      metadata: newMetadata,
      updated_at: new Date().toISOString() 
    })
    .eq('id', payload.userId)

  if (error) {
    return redirect(`/account?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/reports')
  revalidatePath('/account')
  redirect(`/account?success=${encodeURIComponent('Cập nhật thông tin thành công')}`)
}

export async function changePassword(formData: FormData) {
  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (newPassword !== confirmPassword) {
    return redirect(`/account/security?error=${encodeURIComponent('Mật khẩu mới không khớp')}`)
  }

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
  
  // Lấy user hiện tại để kiểm tra mật khẩu cũ
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('password_hash')
    .eq('id', payload.userId)
    .single()

  if (fetchError || !user) {
    return redirect(`/account/security?error=${encodeURIComponent('Không tìm thấy người dùng')}`)
  }

  // Kiểm tra mật khẩu cũ
  const isValid = await bcrypt.compare(oldPassword, user.password_hash)
  if (!isValid) {
    return redirect(`/account/security?error=${encodeURIComponent('Mật khẩu cũ không chính xác')}`)
  }

  // Hash mật khẩu mới
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(newPassword, salt)

  // Cập nhật mật khẩu
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
    .eq('id', payload.userId)

  if (updateError) {
    return redirect(`/account/security?error=${encodeURIComponent('Có lỗi xảy ra khi cập nhật mật khẩu')}`)
  }

  revalidatePath('/account/security')
  redirect(`/account/security?success=${encodeURIComponent('Đổi mật khẩu thành công')}`)
}

export async function updateAvatarUrl(avatarUrl: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return { error: 'Không tìm thấy phiên đăng nhập' }

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) return { error: 'Phiên đăng nhập không hợp lệ' }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('users')
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq('id', payload.userId)

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}
