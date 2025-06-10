'use client'
import { useEffect, useState } from 'react'
import { removeToken } from '@/lib/auth'
import { useRouter } from 'next/router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import { BellRing, LogOut, LucideCircleUser, Settings2 } from 'lucide-react'
import { Button } from '../ui/button'
import DynamicBreadcrumb from './DynamicBreadcrumb'
import { useUser } from '@/lib/UserContext'
import { Badge } from '../ui/badge'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { HeaderThemeToggle } from './header-theme-toggle'
import { NotificationsDropdown } from './NotificationsDropdown'
import TempPasswordAlert from './TempPasswordAlert'
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

const Navbar = () => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { user } = useUser()
  const userId = user?.id
  const companyId = user?.companyId

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!userId) return

    const handleNotification = newNotification => {
      const flatNotifications = newNotification.flat?.() || [newNotification]
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id))
        const filteredNew = flatNotifications.filter(
          n => !existingIds.has(n.id)
        )

        if (filteredNew.length > 0) {
          toast.info(`🔔 You have ${filteredNew.length} new notification(s)!`)
        }
        return [...filteredNew, ...prev]
      })
    }

    socket.off('notificationstats', handleNotification)
    socket.on('notificationstats', handleNotification)
    socket.emit('register', { userId, companyId })
    socket.emit('requestNotification', { userId })

    return () => {
      socket.off('notificationstats', handleNotification)
    }
  }, [userId, companyId])

  if (!mounted) return null

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  function getAvatarColor (name) {
    const colors = [
      'bg-red-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-emerald-500',
      'bg-cyan-500',
      'bg-rose-500'
    ]

    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  return (
    <header className='h-16 flex items-center justify-between px-6 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 shrink-0  gap-2 border-b transition-[width,height] ease-linear '>
      {/* Logo / App Name */}
      {/* <h1 className='text-xl font-semibold tracking-wide'>MyApp</h1> */}
      <DynamicBreadcrumb />

      {/* <TempPasswordAlert /> */}

      {/* Right Section */}
      <div className='flex items-center space-x-4 bg-background text-foreground'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='relative p-0 h-9 w-9 rounded-full bell-icon'
            >
              <BellRing className='w-[40px] h-[40px]' />
              {notifications.length > 0 && (
                <Badge className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full'>
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-80' align='end'>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <NotificationsDropdown
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <HeaderThemeToggle />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar
              className={`cursor-pointer hover:shadow-lg transition duration-200 w-9 h-9 flex items-center justify-center text-xl font-bold text-white ${getAvatarColor(
                user.fullName || user.role
              )}`}
            >
              <AvatarImage src={`/avatars/${user.avatarurl}`} alt='@shadcn' />

              <AvatarFallback>
                {user.fullName
                  ? user.fullName.charAt(0).toUpperCase()
                  : user.role.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side='bottom'
            align='end'
            className='w-70 max-w-2xl p-2'
          >
            <DropdownMenuLabel>
              <div className='flex  space-y-2'>
                <Avatar
                  className={`cursor-pointer hover:shadow-lg transition duration-200 w-9 h-9 flex items-center justify-center text-xl font-bold text-white ${getAvatarColor(
                    user.fullName || user.role
                  )}`}
                >
                  <AvatarImage
                    src={`/avatars/${user.avatarurl}`}
                    alt='@shadcn'
                  />
                  <AvatarFallback>
                    {user.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : user.role.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className='w-full max-w-[200px] mx-2'>
                  <p className='text-sm font-semibold truncate uppercase'>
                    {user.fullName ? user.fullName : user.role}
                  </p>
                  <p className='text-xs truncate text-gray-500'>{user.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className='hover:bg-gray-100 cursor-pointer'
              onClick={() =>
                router.push(
                  `/dashboard/profile/MyProfile?id=${user.id}&companyId=${user.companyId}`
                )
              }
            >
              <LucideCircleUser /> Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              className='hover:bg-gray-100 cursor-pointer'
              onClick={() => router.push('/dashboard/settings/appearance')}
            >
              <Settings2 /> Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className='hover:bg-red-100 text-red-600 font-medium cursor-pointer'
            >
              <LogOut />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Navbar
