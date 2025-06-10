import { decodeRole, getToken, setToken } from '@/lib/auth'
import api from '@/lib/api'
import { sidebarItems } from '@/components/Sidebar-list'

export async function handleLogin ({
  email,
  password,
  setUserContext,
  router,
  onSuccess,
  onError
}) {
  try {
    const response = await api.post('/auth/login', { email, password })
    const data = response.data
    
    setToken(data.token)
    setUserContext(data.user)

    const permissions = data.user?.Role?.Permissions || []
    const redirectUrl = getRedirectPath(data.user.role, permissions)

    onSuccess?.('Login successful!')
    //router.push(redirectUrl)
    router.push('/dashboard')
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Login failed. Please try again.'
    console.error('Login error:', message)
    onError?.(message)
  }
}

function getRedirectPath (userRole, userPermissions = []) {
  if (userRole === 'SUPER_ADMIN') return '/dashboard'

  if (userRole === 'COMPANY_ADMIN') return '/dashboard'

  const permissionKeys = userPermissions.map(p => p.key)

  const hasAccess = item => {
    const roleMatch =
      !item.roles || item.roles.includes(userRole) || item.roles.includes('*')
    const permissionMatch =
      !item.permissions ||
      item.permissions.some(p => permissionKeys.includes(p))
    return roleMatch && permissionMatch
  }

  for (const item of sidebarItems) {
    if (!hasAccess(item)) continue

    if (item.children) {
      const child = item.children.find(childItem => hasAccess(childItem))
      if (child) return child.url
    }

    return item.url
  }

  return '/dashboard/profile'
}
