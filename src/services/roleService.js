import api from '@/lib/api' // Axios instance or fetch wrapper

/**
 * Create a new role with permissions
 * @param {Object} payload - The role data
 * @param {string} payload.name - Role name
 * @param {string} payload.companyId - Associated company ID
 * @param {string[]} payload.permissions - Array of permission IDs
 */
export const createRole = async ({
  name,
  companyId,
  permissions,
  createdBy
}) => {
  try {
    const response = await api.post('/roles/createRole', {
      name,
      companyId,
      permissions,
      createdBy
    })
    return response.data
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

export const fetchAllrole = async ({ companyId }) => {
  try {
    const response = await api.get('/roles', {
      params: { companyId }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error
  }
}

export const fetchRoleById = async (id, companyId) => {
  try {
    const response = await api.get(`/roles/${id}`, {
      params: { companyId }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching role by ID:', error)
    throw error
  }
}

export const updateRole = async ({ roleId, name, permissions, companyId }) => {
  try {
    const response = await api.put(`/roles/updateRole`, {
      roleId,
      name,
      permissions,
      companyId
    })

    return response.data
  } catch (error) {
    console.error('Update Role Error:', error)
    throw error
  }
}

export const fetchRolelist = async companyId => {
  try {
    const response = await api.get(`/roles/fetch-list`, {
      params: { companyId }
    })

    console.log(response);
    
    return response.data
  } catch (error) {
    console.error('Fetch Role List Error:', error)
    throw error
  }
}

export const deleteRole = async (id, companyId) => {
  try {
    const response = await api.delete(`/roles/${id}`, {
      params: { companyId }
    })
    return response.data
  } catch (error) {
    console.error('Delete Role Error:', error)
    throw error
  }
}
