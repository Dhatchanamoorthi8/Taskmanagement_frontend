import { EditUserForm } from '@/forms/userForms/EditUserForm'
import { fetchUserById } from '@/services/userService'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function EditUserPage () {
  const searchParams = useSearchParams()
  const userid = searchParams.get('id')
  const companyId = searchParams.get('companyId')
  const router = useRouter()
  const [userEditData, setUserEditData] = useState(null)

  useEffect(() => {
    if (!userid && !companyId) {
      return
    }
    const fetchData = async () => {
      try {
        const result = await fetchUserById(userid, companyId)
        setUserEditData(result)
      } catch (error) {
        console.error('Error fetching user:', error.message)
      }
    }
    fetchData()
  }, [userid, companyId])

  if (!userEditData) return <div>Loading...</div>

  return (
    <div className='flex justify-center bg-background text-foreground  px-4 py-10 overflow-y-auto p-6'>
      <div className='flex flex-col items-center w-full max-w-4xl space-y-6'>
        <EditUserForm userToEdit={userEditData} />
      </div>
    </div>
  )
}
