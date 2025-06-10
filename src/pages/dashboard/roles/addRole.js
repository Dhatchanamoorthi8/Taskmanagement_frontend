'use client'
import RoleFormAdd from '@/forms/roleForms/RoleFormAdd'
import { useUser } from '@/lib/UserContext'
import { useState, useEffect } from 'react'

export default function CreateRolePage () {
  const { user } = useUser()
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
    <div className='flex justify-center bg-background text-foreground  px-4 py-3 overflow-y-auto'>
      <div className='flex flex-col items-center w-full max-w-4xl'>
        <RoleFormAdd
          companyId={user.companyId}
          mode='create'
          currentUser={{
            roles: user?.Role?.name || user?.role,
            permissions: user?.Role?.Permissions?.map(p => p.key) || []
          }}
        />
      </div>
    </div>
  )
}
