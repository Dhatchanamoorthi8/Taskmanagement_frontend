import api from '@/lib/api'

export const registerCompany = async companyData => {
  try {
    const response = await api.post('companies', companyData)
    return response.data
  } catch (error) {
    const message =
      error.response?.data?.message ||
      'Company registration failed. Please try again.'
    throw new Error(message)
  }
}

export const getallCompany = async () => {
  try {
    const response = await api.get('companies')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Company Fetch Data failed. Please try again.'
    throw new Error(message)
  }
}
