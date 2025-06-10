import { AddTaskForm } from '@/forms/taskForms/AddTaskForm'
import { useUser } from '@/lib/UserContext'
import { fetchUserlist } from '@/services/userService'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useCalendarContext } from '@/components/FullCalendar/calendar-context'

export default function CreateTaskPage () {
  const { user } = useUser()
  const [users, setusers] = useState([])
  const { setEvents } = useCalendarContext()

  console.log(setEvents);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await fetchUserlist(user.companyId)
        setusers(result)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUser()
  }, [user])

  return (
    <div className='flex justify-center bg-background text-foreground  px-4 py-10 overflow-y-auto p-6'>
      <div className='flex flex-col items-center w-full max-w-4xl space-y-6'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>
              Fill in task details to assign a new task.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddTaskForm users={users} user={user} setEvents={setEvents} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
