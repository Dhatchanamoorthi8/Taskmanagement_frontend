// import { Card, CardContent } from "@/components/ui/card";

// export const ProfileSettings = () => {
//   return (
//     <Card className="w-full p-6">
//       <CardContent>
//         <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
//         <p className="text-muted-foreground text-sm">This is where profile preferences will go.</p>
//       </CardContent>
//     </Card>
//   );
// };

import { Card, CardContent } from '@/components/ui/card'
import EditProfileForm from '@/forms/ProfileForm/EditProfileForm'
import { fetchUserById } from '@/services/userService'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfileSettingsPage () {
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
    <div className='w-full px-6'>
      <EditProfileForm profileData={profileData} />
    </div>
  )
}
