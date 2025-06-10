import { jwtDecode } from 'jwt-decode'

// export function getToken () {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('token')
//   }
//   return null
// }

// export function setToken (token) {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('token', token)
//   }
// }

export function getToken () {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000 // seconds
      if (decoded.exp < currentTime) {
        // Token expired
        //removeToken()
        return null
      }
      return token
    } catch (err) {
      removeToken()
      return null
    }
  }
  return null
}

export function setToken (token) {
  if (typeof window !== 'undefined') {
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000
      console.log('Decoded token:', decoded)
      console.log('Current time:', currentTime)

      if (decoded.exp < currentTime) {
        console.warn('Token is already expired.')
        //removeToken()
        return
      }

      localStorage.setItem('token', token)
      const expiresIn = decoded.exp * 1000 - Date.now()
      setTimeout(() => {
        removeToken()
        window.location.href = '/login'
      }, expiresIn)
    } catch (err) {
      console.error('Invalid token:', err)
      removeToken()
    }
  }
}

export function removeToken () {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('previousPage')
  }
}

export function decodeRole (token) {
  try {
    const decoded = jwtDecode(token)
    return decoded.role
  } catch {
    return null
  }
}
