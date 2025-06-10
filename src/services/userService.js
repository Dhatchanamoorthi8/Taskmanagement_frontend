import api from '@/lib/api'

export const createUser = async createuser => {
  try {
    const response = await api.post('/users', createuser)
    return response.data
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

export const fetchUserlist = async companyId => {
  try {
    const response = await api.get(`/users/fetch-list`, {
      params: { companyId }
    })
    return response.data
  } catch (error) {
    console.error('Fetch Role List Error:', error)
    throw error
  }
}

export const fetchUserById = async (id, companyId) => {

  
  try {
    const response = await api.get('/users', {
      params: { id, companyId }
    })
    return response.data
  } catch (error) {
    console.error('Fetch User Error:', error)
    throw error
  }
}

export const updateUser = async userData => {
  try {
    const { id, ...payload } = userData
    const response = await api.put(`/users/${id}`, payload)
    return response.data
  } catch (error) {
    console.error('Update user error:', error)
    throw error
  }
}

export const updateactiveStatus = async id => {
  try {
    const response = await api.post(`/users/userinactive/${id}`)
    return response.data
  } catch (error) {
    console.error('Delete user Error:', error)
    throw error
  }
}

export const deleteUser = async (id, companyId) => {
  try {
    const response = await api.delete(`/users/${id}`, {
      params: { companyId }
    })
    return response.data
  } catch (error) {
    console.error('Delete user Error:', error)
    throw error
  }
}


export const updateUserProfile = async (id, data) => {
  try {
    const response = await api.put(`/users/profileUpdate/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Update failed:', error)
    throw error
  }
} 