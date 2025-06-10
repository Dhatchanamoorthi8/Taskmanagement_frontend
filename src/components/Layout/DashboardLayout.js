import { getToken, decodeRole } from '@/lib/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/lib/UserContext'
import Navbar from '../header/Navbar'
import { AppSidebar } from '../Sidebar'
import { SidebarInset, SidebarProvider } from '../ui/sidebar'
const DashboardLayout = ({ children }) => {
  const [role, setRole] = useState(null)
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
    } else {
      const decodedRole = decodeRole(token)
      setRole(decodedRole)
    }
  }, [])

  if (!role) return null

  return (
    <SidebarProvider>
      <AppSidebar
        currentUser={{
          roles: [user?.Role?.name || user?.role],
          permissions: user?.Role?.Permissions?.map(p => p.key) || []
        }}
      />
      <SidebarInset>
        <Navbar />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
