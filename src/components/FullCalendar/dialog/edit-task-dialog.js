import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useCalendarContext } from '../calendar-context'
import { useUser } from '@/lib/UserContext'
import { useEffect, useState } from 'react'
import { fetchUserlist } from '@/services/userService'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EditTaskForm } from '@/forms/taskForms/EditTaskForm'

export default function CalendarEditTaskDialog () {
  const { user } = useUser()
  const [users, setUsers] = useState([])
  const { manageEventDialogOpen, setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents
  } = useCalendarContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchUserlist(user.companyId)
        setUsers(result)
      } catch (error) {
        console.error('Error fetching users or tasks:', error)
      }
    }

    if (manageEventDialogOpen && user?.companyId) {
      fetchData()
    }
  }, [manageEventDialogOpen, user?.companyId, user?.id])


  function handleClose () {
    setManageEventDialogOpen(false)
    setSelectedEvent(null)
  }

  return (
    <Dialog open={manageEventDialogOpen} onOpenChange={handleClose} >
      <DialogContent
        onInteractOutside={e => e.preventDefault()}
        className='w-full max-w-2xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-4 sm:p-6'
      >
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>

        <ScrollArea className='max-h-[80vh] w-full'>
          <EditTaskForm
            users={users}
            initialData={selectedEvent}
            className='p-2'
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
