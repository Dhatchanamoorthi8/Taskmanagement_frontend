import { useEffect } from 'react'
import { useRouter } from 'next/router'

export function useBreadcrumbHistory () {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = url => {
      if (url === '/login') return
      const current = window.location.pathname
      localStorage.setItem('previousPage', current)
    }

    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])
}
