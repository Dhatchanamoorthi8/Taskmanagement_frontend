import api from '@/lib/api'

export const createTask = async taskData => {
  try {
    const response = await api.post('/tasks', taskData)
    return response.data
  } catch (error) {
    const backendMessage = error?.response?.data?.message
    const backendSuggestion = error?.response?.data?.suggestion
    const customError = new Error(backendMessage || 'Failed to create task')
    if (backendSuggestion) {
      customError.suggestion = backendSuggestion
    }
    console.error('Task creation failed:', backendMessage || error.message)
    throw customError
  }
}

export const fetchAlltask = async companyId => {
  try {
    const response = await api.get(`/tasks/company/${companyId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching tasks:', error.message)
    throw error
  }
}

export const deletetask = async id => {
  try {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting task:', error.message)
    throw error
  }
}

export const fetchTaskById = async (id, companyId) => {
  try {
    const response = await api.get(`/tasks/company/${companyId}/task/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching task by ID:', error.message)
    throw error
  }
}

/**
 * Update a task by ID for a specific company.
 *
 * @param {string} id
 * @param {string} companyId
 * @param {Object} updatedData
 * @returns {Promise<Object>}
 */
export const updateTask = async (id, companyId, updatedData) => {
  try {
    const response = await api.put(
      `/tasks/company/${companyId}/task/${id}`,
      updatedData
    )
    return response.data
  } catch (error) {
    console.error('Error updating task:', error.message)
    throw error
  }
}

export const myallTask = async userId => {
  try {
    const response = await api.get(`/tasks/user/task/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

export const updateTaskStatus = async (id, data) => {
  try {
    const response = await api.post(`/tasks/user/task/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating task:', error.message)
    throw error
  }
}
