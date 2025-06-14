import { UserProvider } from '@/lib/UserContext'
import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { useRouter } from 'next/router'
import { Toaster } from '@/components/ui/sonner'
import { useEffect, useState } from 'react'
import PageLoader from '@/components/PageLoader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import CalendarProvider from '@/components/FullCalendar/calendar-provider'
export default function App ({ Component, pageProps }) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [events, setEvents] = useState([])
  const [mode, setMode] = useState('month')
  const [date, setDate] = useState(new Date())

  const isDashboardRoute = router.pathname.startsWith('/dashboard')

  const getLayout = isDashboardRoute
    ? page => <DashboardLayout>{page}</DashboardLayout>
    : page => page

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
      <UserProvider>
        <CalendarProvider
          events={events}
          setEvents={setEvents}
          mode={mode}
          setMode={setMode}
          date={date}
          setDate={setDate}
        >
          <NuqsAdapter>
            {loading && <PageLoader />}
            {getLayout(<Component {...pageProps} />)}
          </NuqsAdapter>
        </CalendarProvider>
      </UserProvider>
      <Toaster richColors />
    </ThemeProvider>
  )
}

// import { useEffect } from 'react'
// import { useRouter } from 'next/router'
// import { UserProvider } from '@/lib/UserContext'
// import '@/styles/globals.css'
// import { ThemeProvider } from 'next-themes'
// import DashboardLayout from '@/components/DashboardLayout'
// import { Toaster } from '@/components/ui/sonner'
// import { getToken, decodeRole } from '@/lib/auth'
// import { routeAccessMap } from '@/lib/routeAccess'
// import { hasAccess } from '@/lib/access'

// export default function App({ Component, pageProps }) {
//   const router = useRouter()
//   const path = router.pathname
//   const isDashboardRoute = path.startsWith('/dashboard')

//   // Global access protection
//   useEffect(() => {
//     if (!isDashboardRoute) return

//     const token = getToken()

//     if (!token) {
//       router.replace('/login')
//       return
//     }

//     const currentUser = decodeRole(token)
//     const accessConfig = routeAccessMap[path]

//     if (accessConfig && !hasAccess(accessConfig, currentUser)) {
//       router.replace('/dashboard/tasks') // fallback page if blocked
//     }
//   }, [path])

//   const getLayout = isDashboardRoute
//     ? page => <DashboardLayout>{page}</DashboardLayout>
//     : page => page

//   return (
//     <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
//       <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>
//       <Toaster />
//     </ThemeProvider>
//   )
// }
