//idnex.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getToken, decodeRole } from '@/lib/auth'

export default function HomePage () {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()

    if (token) {
      const role = decodeRole(token)
      router.push('/dashboard')
    } else {
      router.push('/login')
    }

    const handleBeforeUnload = () => {
      localStorage.clear()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [router])

  return null
}
