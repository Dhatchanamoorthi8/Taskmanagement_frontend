import api from '@/lib/api'

// Send OTP to email
export const sendOtp = async email => {
  try {
    const response = await api.post('/otp/send', { email })
    return response.data
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to send OTP. Please try again.'
    throw new Error(message)
  }
}

// Verify the OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post('/otp/verify', { email, otp })
    return response.data
  } catch (error) {
    const message =
      error.response?.data?.message ||
      'OTP verification failed. Please try again.'
    throw new Error(message)
  }
}
