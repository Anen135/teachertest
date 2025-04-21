// components/NavigationConfirm.jsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export const NavigationConfirm = ({
  message = 'Вы уверены, что хотите выйти?'
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = message
      return message
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [message])

  useEffect(() => {
    // This effect will run when route changes
    // But we can't intercept the navigation in App Router like we could in Pages Router
    // So we'll just show a confirmation when the component unmounts due to route change
  }, [pathname, searchParams])

  return null
}