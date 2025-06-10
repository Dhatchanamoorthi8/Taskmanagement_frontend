import { createContext, useContext, useEffect, useState } from 'react'

// Define the initial context structure
const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Set entire user object
  const setUserContext = userData => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }


  const updateUserField = (field, value) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, [field]: value }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  return (
    <UserContext.Provider value={{ user, setUserContext, updateUserField }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook for accessing the user context
export const useUser = () => useContext(UserContext)
