import api from '@/lib/api'

// export const fetchuserDashboardList = async (mood, userId) => {
//   try {
//     const url = `/dashboard/usertasklist/${userId}${
//       mood ? `?mood=${mood}` : ''
//     }`
//     const response = await api.get(url)
//     return response.data
//   } catch (error) {
//     console.error('Error fetching user task list:', error)
//     throw error
//   }
// }

// export const fetchadminDashboardList = async (mood, companyId, date) => {
//   console.log(mood, companyId, date)

//   try {
//     const url = `/dashboard/admintasklist/${companyId}${
//       mood ? `?mood=${mood}` : ''
//     }`
//     const response = await api.get(url)
//     return response.data
//   } catch (error) {
//     console.error('Error fetching admin task list:', error)
//     throw error
//   }
// }

export const fetchuserDashboardList = async (mood, userId, date) => {
  try {
    const params = new URLSearchParams()

    if (mood) params.append('mood', mood)
    if (date?.from) params.append('startDate', date.from.toISOString())
    if (date?.to) params.append('endDate', date.to.toISOString())

    const url = `/dashboard/usertasklist/${userId}?${params.toString()}`
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching user task list:', error)
    throw error
  }
}

export const fetchadminDashboardList = async (mood, companyId, date) => {
  try {
    const params = new URLSearchParams()

    if (mood) params.append('mood', mood)
    if (date?.from) params.append('startDate', date.from.toISOString())
    if (date?.to) params.append('endDate', date.to.toISOString())

    const url = `/dashboard/admintasklist/${companyId}?${params.toString()}`
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching admin task list:', error)
    throw error
  }
}
