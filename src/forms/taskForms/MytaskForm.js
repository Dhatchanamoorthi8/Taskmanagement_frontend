import React, { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'
import { myallTask, updateTaskStatus } from '@/services/taskService'
import { useCalendarContext } from '@/components/FullCalendar/calendar-context'

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  remark: z.string().min(1, 'Remarks are required'),
  status: z.enum(['yet_to_start', 'in_progress', 'completed', 'not_completed']),
  companyId: z.string(),
  updatedBy: z.string()
})

export const MytaskForm = ({ user, editData, setData, setDrawerOpen }) => {
  const { setisUserupdateTask, events, setEvents } = useCalendarContext()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: editData?.title || '',
      remarks: '',
      status: editData?.status || 'yet_to_start',
      companyId: user?.companyId || '',
      updatedBy: user?.id || ''
    }
  })

  const onSubmit = async values => {
    setIsSubmitting(true)

    const statusChanged = values.status !== editData?.status
    const trimmedRemark = values.remark?.trim()

    if (!statusChanged) {
      form.setError('status', {
        type: 'manual',
        message:
          'Status is unchanged. Please select a different status to update.'
      })
      toast.info('Status is the same. No changes to update.')
      setIsSubmitting(false)
      return
    }

    if (statusChanged && !trimmedRemark) {
      toast.error('Remarks are required when changing the status.')
      setIsSubmitting(false)
      return
    }

    try {
      await updateTaskStatus(editData.id, values)
      const result = await myallTask(user.id)

      console.log(result)

      if (setData) setData(result)
      if (setDrawerOpen) setDrawerOpen(false)
      if (setisUserupdateTask) setisUserupdateTask(false)

      const updatedEvent = {
        ...editData,
        status: values.status
      }

      console.log(updatedEvent)

      setEvents(
        events.map(event => (event.id === editData.id ? updatedEvent : event))
      )
      toast.success('Task status updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Something went wrong while updating the task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} disabled placeholder='Task Title' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className='w-full h-10'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='yet_to_start'>Yet to Start</SelectItem>
                  <SelectItem value='in_progress'>In Progress</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='not_completed'>Not Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='remark'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Remarks'
                  rows={4}
                  className='resize-none'
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div>
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isSubmitting ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
