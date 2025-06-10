'use client'
import RoleFormEdit from '@/forms/roleForms/RoleFormEdit'
import { useUser } from '@/lib/UserContext'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditRolePage () {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const companyId = searchParams.get('companyId')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.companyId) {
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex justify-center bg-background text-foreground px-4 py-3 overflow-y-auto'>
      <div className='flex flex-col items-center w-full max-w-4xl'>
        <RoleFormEdit
          companyId={user.companyId || companyId}
          mode='edit'
          currentUser={{
            roles: user?.Role?.name || user?.role,
            permissions: user?.Role?.Permissions?.map(p => p.key) || []
          }}
          roleId={id}
        />
      </div>
    </div>
  )
}
