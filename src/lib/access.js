// // lib/access.js
// export const hasAccess = (item, currentUser) => {
//   const { roles = [], permissions = [] } = currentUser

//   // Check role access
//   if (item.roles && !item.roles.some(r => roles.includes(r))) {
//     return false
//   }

//   // If user is COMPANY_ADMIN, bypass permission check
//   if (roles.includes('COMPANY_ADMIN')) {
//     return true
//   }

//   // Otherwise, check permission access
//   if (item.permissions && !item.permissions.some(p => permissions.includes(p))) {
//     return false
//   }

//   return true
// }


export const hasAccess = (item, currentUser) => {
  const { roles = [], permissions = [] } = currentUser

  const roleMatch =
    item.roles?.includes('*') || item.roles?.some(r => roles.includes(r))

  if (!roleMatch) {
    return false
  }

  if (roles.includes('COMPANY_ADMIN')) {
    return true
  }

  if (item.permissions && !item.permissions.some(p => permissions.includes(p))) {
    return false
  }

  return true
}


