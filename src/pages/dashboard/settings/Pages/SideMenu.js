import Link from 'next/link'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils' // Assuming cn is a utility function like classnames or clsx
import { useUser } from '@/lib/UserContext'

export const SideMenu = () => {
  const { user } = useUser()
  const menuItems = [
    {
      title: 'Profile',
      url: `/dashboard/settings/profile?id=${user.id}&companyId=${user.companyId}`
    },
    {
      title: 'Account',
      url: '/dashboard/settings/account'
    },
    {
      title: 'Appearance',
      url: '/dashboard/settings/appearance'
    }
  ]
  const router = useRouter()
  const current = router.pathname.split('/').pop()?.toLowerCase()

  return (
    <div className='w-48 border-r pr-4 space-y-2'>
      {menuItems.map(item => (
        <Link href={item.url} key={item.title}>
          <button
            className={cn(
              'block w-full text-left px-4 py-2 rounded-md hover:bg-muted',
              current === item.title.toLowerCase() &&
                'border border-primary bg-muted text-primary'
            )}
          >
            {item.title}
          </button>
        </Link>
      ))}
    </div>
  )
}
