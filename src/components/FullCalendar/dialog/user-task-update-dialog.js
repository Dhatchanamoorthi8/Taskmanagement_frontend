import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useCalendarContext } from '../calendar-context'
import { useUser } from '@/lib/UserContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MytaskForm } from '@/forms/taskForms/MytaskForm'

export default function UserTaskUpdateDialog () {
  const { user } = useUser()
  const {
    isUserupdateTask,
    setisUserupdateTask,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents
  } = useCalendarContext()

  function handleClose () {
    setisUserupdateTask(false)
    setSelectedEvent(null)
  }

  return (
    <Dialog open={isUserupdateTask} onOpenChange={handleClose}>
      <DialogContent
        onInteractOutside={e => e.preventDefault()}
        className='w-full max-w-2xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-4 sm:p-6'
      >
        <DialogHeader>
          <DialogTitle>User Task Update</DialogTitle>
        </DialogHeader>

        <ScrollArea className='max-h-[80vh] w-full'>
          <MytaskForm
            user={user}
            editData={selectedEvent}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
