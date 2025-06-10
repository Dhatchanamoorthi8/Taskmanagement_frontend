import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { AvatarImage } from '@radix-ui/react-avatar'
import { formatDistance, subDays } from 'date-fns'

export function NotificationsDropdown ({ notifications, setNotifications }) {
  console.log(notifications)

  const [showAll, setShowAll] = useState(false)

  const visibleNotifications = showAll
    ? notifications
    : notifications.slice(0, 5)

  const clearAll = () => setNotifications([])

  const getAvatarColor = name => {
    const colors = [
      'bg-slate-500',
      'bg-gray-500',
      'bg-zinc-500',
      'bg-neutral-500',
      'bg-stone-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500'
    ]
    if (!name) return colors[0]
    const index = (name.charCodeAt(0) - 65) % colors.length
    return colors[index]
  }

  if (!notifications.length) {
    return (
      <div className='flex justify-center items-center p-4 text-sm text-muted-foreground'>
        No notifications.
      </div>
    )
  }

  return (
    <div>
      <div className='flex justify-between items-center px-2 pb-2'>
        <span className='text-sm text-muted-foreground'>
          You have {notifications.length} notification
          {notifications.length > 1 && 's'}
        </span>
        {/* <Button
          variant='ghost'
          className='text-xs font-bold text-red-400 hover:text-red-800'
          onClick={clearAll}
        >
          Clear All
        </Button> */}
      </div>

      <ScrollArea className='max-h-64 px-1'>
        {visibleNotifications.map(note => (
          <DropdownMenuItem key={note.id} className='gap-2 items-start py-2'>
            <Avatar
              className={`w-9 h-9 font-semibold flex items-center justify-center ${getAvatarColor(
                note?.fromUser?.fullName || 'D'
              )}`}
            >
              <AvatarImage
                src={`/avatars/${note?.fromUser?.avatarurl}`}
                alt={note?.fromUser?.fullName || 'User'}
              />
              <AvatarFallback>
                {note?.fromUser?.fullName.charAt(0).toUpperCase() || 'D'}
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-col w-full'>
              <p className='text-sm font-medium text-foreground'>
                {note.title}
              </p>
              <p className='text-xs text-muted-foreground line-clamp-2'>
                {note.description}
              </p>
              <span className='text-[10px] text-gray-400 mt-1'>
                {note.createdAt && !isNaN(new Date(note.createdAt))
                  ? formatDistance(new Date(note.createdAt), new Date(), {
                      addSuffix: true
                    })
                  : 'Unknown time'}
              </span>
            </div>
          </DropdownMenuItem>
        ))}

        <div className=' col-span-2'>
          <DropdownMenuSeparator className={'my-4 '} />
          <DropdownMenuLabel className={' text-center'}>
            <Button variant='outline' onClick={clearAll}>
              Clear All Notifications
            </Button>
          </DropdownMenuLabel>
        </div>

        {notifications.length > 5 && (
          <div className='text-center mt-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-xs text-blue-600 hover:underline'
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'Show All'}
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
