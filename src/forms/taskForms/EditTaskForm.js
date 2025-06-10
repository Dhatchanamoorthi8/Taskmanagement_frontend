'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { TaskSchema } from '@/validation/taskSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

import { updateTask } from '@/services/taskService'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { DateTimePicker } from '@/components/DateTimePicker'
import { useCalendarContext } from '@/components/FullCalendar/calendar-context'
import { ColorPicker } from '@/components/FullCalendar/color-picker'

export const EditTaskForm = ({ users = [], initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reassignReason, setReassignReason] = useState('')
  const [pendingAssignee, setPendingAssignee] = useState(null)
  const [showReassignConfirm, setShowReassignConfirm] = useState(false)

  const {
    manageEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    events,
    setEvents
  } = useCalendarContext()

  // const form = useForm({
  //   resolver: zodResolver(TaskSchema),
  //   defaultValues: {
  //     title: initialData?.title || '',
  //     description: initialData?.description || '',
  //     startDate: initialData?.startDate || initialData?.start || '',
  //     endDate: initialData?.endDate || initialData?.end || '',
  //     assignedToId: initialData?.assignedToId || '',
  //     companyId: initialData?.companyId || ''
  //   }
  // })

  const form = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      startDate:
        initialData?.startDate ??
        (typeof initialData?.start === 'string'
          ? initialData.start
          : initialData?.start?.toISOString()) ??
        '',
      endDate:
        initialData?.endDate ??
        (typeof initialData?.end === 'string'
          ? initialData.end
          : initialData?.end?.toISOString()) ??
        '',
      assignedToId: initialData?.assignedToId || '',
      companyId: initialData?.companyId || '',
      color: initialData?.color,
      status: initialData?.status
    }
  })

  useEffect(() => {
    console.log('Form errors:', form.formState.errors)
  }, [form.formState.errors])

  const { isDirty } = form.formState
  const onSubmit = async values => {
    setIsSubmitting(true)
    try {
      const isReassigned = values.assignedToId !== initialData.assignedToId

      if (isReassigned) {
        if (!reassignReason.trim()) {
          toast.error('Please provide a reason for reassigning the task.')
          setIsSubmitting(false)
          return
        }
        updatedData.reassignReason = reassignReason
      }

      await updateTask(initialData.id, initialData.companyId, values)

      const updatedEvent = {
        ...initialData,
        title: values.title,
        description: values.description,
        start: values.startDate,
        end: values.endDate,
        assignedToId: values.assignedToId,
        companyId: values.companyId,
        color: values.color
      }

      setEvents(
        events.map(event =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
      )
      setManageEventDialogOpen(false)
      toast.success('Task updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Something went wrong while updating the task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className='py-10 w-full'>
        {isSubmitting && <Progress value={70} className='mb-4 w-full' />}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-1 sm:grid-cols-2 gap-4'
          >
            {/* Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder='Task Title'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assign To */}
            <FormField
              control={form.control}
              name='assignedToId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    value={field.value}
                    onValueChange={value => {
                      if (value !== initialData.assignedToId) {
                        setPendingAssignee(value)
                        setShowReassignConfirm(true)
                      } else {
                        field.onChange(value)
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full h-10'>
                        <SelectValue placeholder='Select an employee' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start DateTime Picker */}
            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? new Date(field.value) : null}
                      onChange={date =>
                        field.onChange(date?.toISOString() || '')
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End DateTime Picker */}
            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? new Date(field.value) : null}
                      onChange={date =>
                        field.onChange(date?.toISOString() || '')
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={true}
                      placeholder='Task Title'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder='Task Description'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {manageEventDialogOpen && (
              <FormField
                control={form.control}
                name='color'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold'>Color</FormLabel>
                    <FormControl>
                      <ColorPicker field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Submit */}
            <div className='sm:col-span-2'>
              <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {isSubmitting ? 'Updating...' : 'Update Task'}
              </Button>
            </div>
          </form>
        </Form>

        {/* Reassign confirmation dialog */}
        <Dialog
          open={showReassignConfirm}
          onOpenChange={setShowReassignConfirm}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reassign Task</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to assign this task to another user?</p>
            <div className='mt-4 grid w-full gap-1.5'>
              <Label>Reason for reassignment</Label>
              <Textarea
                value={reassignReason}
                onChange={e => setReassignReason(e.target.value)}
                placeholder="Explain why you're reassigning this task"
              />
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setShowReassignConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  form.setValue('assignedToId', pendingAssignee)
                  setShowReassignConfirm(false)
                }}
                disabled={reassignReason.trim().length < 2}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
