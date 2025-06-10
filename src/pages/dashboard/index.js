import { useUser } from '@/lib/UserContext'
import { CompanyDashboard } from './Index/CompanyDashboard'
import { UserDashboard } from './Index/UserDashboard'

export default function DashboardPage () {
  const { user } = useUser()

  const roleName = user?.Role?.name || user?.role

  const isCompany = roleName === 'COMPANY_ADMIN'
  const isUser = !['COMPANY_ADMIN', 'SUPER_ADMIN'].includes(roleName)

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          {isCompany && <CompanyDashboard />}
          {isUser && <UserDashboard />}
        </div>
      </div>
    </div>
  )
}
