import api from '@/lib/api'

export const fetchuserDashboardList = async (mood, userId) => {
  try {
    const url = `/dashboard/usertasklist/${userId}${mood ? `?mood=${mood}` : ''}`
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching user task list:', error)
    throw error
  }
}

export const fetchadminDashboardList = async (mood, companyId) => {

  console.log(mood,companyId);
  
  try {
    const url = `/dashboard/admintasklist/${companyId}${mood ? `?mood=${mood}` : ''}`
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching admin task list:', error)
    throw error
  }
}
