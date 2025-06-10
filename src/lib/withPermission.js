// // lib/checkPermission.ts
// import { useRouter } from 'next/router'
// import { useEffect } from 'react'
// import { useUser } from './UserContext'
// import { routePermissions } from './routeAccess'

// export const useRoutePermission = () => {
//   const router = useRouter()
//   const { user } = useUser()

//   useEffect(() => {
//     if (!user) return

//     const currentPath = router.pathname.toLowerCase()
//     const requiredPermissions = routePermissions[currentPath] || []
//     const userPermissions = user?.Role?.Permissions?.map(p => p.key) || []
//     const userRole = user?.Role?.name?.toUpperCase() || user?.role?.toUpperCase()

//     const isSuperAdmin = userRole === 'SUPER_ADMIN'
//     const isCompanyAdmin = userRole === 'COMPANY_ADMIN'

//     if (isCompanyAdmin && currentPath.startsWith('/dashboard/company')) {
//       router.replace('/dashboard/tasks')
//       return
//     }

//     // ✅ Allow SUPER_ADMIN always
//     if (isSuperAdmin) return

//     // ✅ For other roles, enforce permission checks
//     const hasPermission = requiredPermissions.every(p =>
//       userPermissions.includes(p)
//     )

//     if (!hasPermission) {
//       router.replace('/login')
//     }
//   }, [router.pathname, user])
// }
