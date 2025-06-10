import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useCalendarContext } from '../calendar-context'
import { AddTaskForm } from '@/forms/taskForms/AddTaskForm'
import { useUser } from '@/lib/UserContext'
import { useEffect, useState } from 'react'
import { fetchUserlist } from '@/services/userService'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function CalendarNewTaskDialog () {
  const { user } = useUser()

  const [users, setUsers] = useState([])
  const { newEventDialogOpen, setNewEventDialogOpen, setEvents } =
    useCalendarContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchUserlist(user.companyId)
        setUsers(result)
      } catch (error) {
        console.error('Error fetching users or tasks:', error)
      }
    }

    if (newEventDialogOpen && user?.companyId) {
      fetchData()
    }
  }, [newEventDialogOpen, user?.companyId, user?.id])

  return (
    <Dialog open={newEventDialogOpen} onOpenChange={setNewEventDialogOpen}>
      <DialogContent
        onInteractOutside={e => e.preventDefault()}
        className='w-full max-w-2xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-4 sm:p-6'
      >
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>

        <ScrollArea className='max-h-[80vh] w-full'>
          <AddTaskForm
            users={users}
            user={user}
            setEvents={setEvents}
            setNewEventDialogOpen={setNewEventDialogOpen}
            newEventDialogOpen={newEventDialogOpen}
            className='p-2'
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
