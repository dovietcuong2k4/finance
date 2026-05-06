'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { verifyToken } from '@/utils/auth'
import { createAdminClient } from '@/utils/supabase/admin'

export async function getTransactions({
  page = 1,
  pageSize = 10,
  type,
  search,
  category,
  startDate,
  endDate,
}: {
  page?: number
  pageSize?: number
  type?: 'income' | 'expense'
  search?: string
  category?: string
  startDate?: string
  endDate?: string
} = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return { data: [], total: 0 }

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) return { data: [], total: 0 }

  const supabase = createAdminClient()

  // Build query for count
  let countQuery = supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', payload.userId)

  // Build query for data
  let dataQuery = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', payload.userId)
    .order('transaction_date', { ascending: false })

  // Apply filters
  if (type) {
    countQuery = countQuery.eq('type', type)
    dataQuery = dataQuery.eq('type', type)
  }

  if (search) {
    const searchFilter = `title.ilike.%${search}%,category.ilike.%${search}%`
    countQuery = countQuery.or(searchFilter)
    dataQuery = dataQuery.or(searchFilter)
  }

  // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  dataQuery = dataQuery.range(from, to)

  const [{ count }, { data, error }] = await Promise.all([
    countQuery,
    dataQuery,
  ])

  if (error) {
    console.error('Error fetching transactions:', error)
    return { data: [], total: 0 }
  }

  return {
    data: data || [],
    total: count || 0,
  }
}

export async function deleteTransaction(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return { error: 'Không tìm thấy phiên đăng nhập' }

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) return { error: 'Phiên đăng nhập không hợp lệ' }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', payload.userId)

  if (error) {
    console.error('Error deleting transaction:', error)
    return { error: 'Có lỗi xảy ra khi xóa giao dịch' }
  }

  revalidatePath('/')
  revalidatePath('/transactions')
  return { success: true }
}

export async function updateTransaction(id: string, data: {
  type: string
  title: string
  category: string
  amount: number
  transaction_date: string
  description?: string | null
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return { error: 'Không tìm thấy phiên đăng nhập' }

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) return { error: 'Phiên đăng nhập không hợp lệ' }

  if (!data.title || !data.amount || !data.transaction_date || !data.type || !data.category) {
    return { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc' }
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('transactions')
    .update({
      type: data.type,
      title: data.title,
      category: data.category,
      amount: data.amount,
      transaction_date: new Date(data.transaction_date).toISOString(),
      description: data.description || null,
    })
    .eq('id', id)
    .eq('user_id', payload.userId)

  if (error) {
    console.error('Error updating transaction:', error)
    return { error: 'Có lỗi xảy ra khi cập nhật giao dịch' }
  }

  revalidatePath('/')
  revalidatePath('/transactions')
  return { success: true }
}

export async function createTransaction(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { error: 'Không tìm thấy phiên đăng nhập' }
  }

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) {
    return { error: 'Phiên đăng nhập không hợp lệ' }
  }

  const type = formData.get('type') as string
  const title = formData.get('title') as string
  const amountStr = formData.get('amount') as string
  const amount = parseFloat(amountStr)
  const transactionDate = formData.get('transactionDate') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string

  if (!title || isNaN(amount) || !transactionDate || !type || !category) {
    return { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc' }
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: payload.userId,
        type: type,
        title: title,
        category: category,
        amount: amount,
        transaction_date: new Date(transactionDate).toISOString(),
        description: description || null
      }
    ])

  if (error) {
    console.error('Lỗi khi tạo giao dịch:', error)
    return { error: 'Có lỗi xảy ra khi tạo giao dịch. Vui lòng đảm bảo bạn đã tạo bảng transactions trong database.' }
  }

  revalidatePath('/')
  revalidatePath('/transactions')
  
  return { success: true }
}
