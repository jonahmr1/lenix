'use client'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function AuthLoading() {
  useEffect(() => {
    const id = toast.loading('Checking your session…')
    return () => {
      toast.dismiss(id)
    }
  }, [])

  return null
}
