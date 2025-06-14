import { useUser } from '@/lib/UserContext'
import CompanyDashboardPage from './Index/CompanyDashboard'
import UserDashboardPage from './Index/UserDashboard'
export default function DashboardPage () {
  const { user } = useUser()

  const roleName = user?.Role?.name || user?.role

  const isCompany = roleName === 'COMPANY_ADMIN'
  const isUser = !['COMPANY_ADMIN', 'SUPER_ADMIN'].includes(roleName)

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          {isCompany && <CompanyDashboardPage />}
          {isUser && <UserDashboardPage />}
        </div>
      </div>
    </div>
  )
}
