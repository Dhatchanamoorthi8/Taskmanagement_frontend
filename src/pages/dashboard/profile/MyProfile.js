'use client'
import EditProfileForm from '@/forms/ProfileForm/EditProfileForm'
import { fetchUserById } from '@/services/userService'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MyProfilePage () {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const companyId = searchParams.get('companyId')

  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !companyId) return

    const fetchProfileData = async () => {
      try {
        setLoading(true)
        const result = await fetchUserById(id, companyId)
        setProfileData(result)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [id, companyId])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-lg text-muted-foreground'>Loading profile...</p>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-lg text-red-500'>Profile not found.</p>
      </div>
    )
  }

  return (
    <div className='flex justify-center bg-background text-foreground px-4 py-3 overflow-y-auto'>
      <div className='flex flex-col items-center w-full max-w-4xl'>
        <EditProfileForm profileData={profileData} />
      </div>
    </div>
  )
}
