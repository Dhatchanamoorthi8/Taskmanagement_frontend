'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@/lib/UserContext'
import { fetchTaskById } from '@/services/taskService'
import { fetchUserlist } from '@/services/userService'
import { EditTaskForm } from '@/forms/taskForms/EditTaskForm'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function EditTaskPage () {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const companyId = searchParams.get('companyId')
  const [loading, setLoading] = useState(true)
  const [taskData, setTaskData] = useState(null)
  const [users, setUsers] = useState([])
  useEffect(() => {
    if (!id || !companyId || !user?.companyId) return

    const fetchData = async () => {
      try {
        const taskResult = await fetchTaskById(id, companyId)
        const usersResult = await fetchUserlist(user.companyId)
        setTaskData(taskResult)
        setUsers(usersResult)
      } catch (error) {
        console.error('Error fetching data:', error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, companyId, user?.companyId])

  if (loading || !taskData) return <div>Loading...</div>

  return (
    <div className='flex justify-center bg-background text-foreground px-4 py-3 overflow-y-auto'>
      <div className='flex flex-col items-center w-full max-w-4xl'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
            <CardDescription>Update the details of the task.</CardDescription>
          </CardHeader>
          <CardContent>
            <EditTaskForm users={users} initialData={taskData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
