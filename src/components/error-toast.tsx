'use client'

import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function ErrorToast({ message, type = 'error' }: { message?: string, type?: 'error' | 'success' }) {
  useEffect(() => {
    if (message) {
      if (type === 'error') {
        toast.error(message)
      } else {
        toast.success(message)
      }
    }
  }, [message, type])

  return null
}
