'use client'

import React, { useState } from 'react'
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
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { createTask } from '@/services/taskService'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { DateTimePicker } from '@/components/DateTimePicker'
import { ColorPicker } from '@/components/FullCalendar/color-picker'

export const AddTaskForm = ({
  users = [],
  user,
  setEvents,
  setNewEventDialogOpen,
  newEventDialogOpen,
  className
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      assignedToId: '',
      companyId: user?.companyId || '',
      createdBy: user?.id || '',
      color: 'blue'
    }
  })
  const onSubmit = async values => {
    setIsSubmitting(true)
    try {
      const taskData = {
        ...values,
        companyId: user?.companyId,
        createdBy: user?.id
      }
      const result = await createTask(taskData)

      console.log(result, ' result')

      const formattedEvents = {
        id: result.id,
        title: result.title,
        description: result.description,
        start: result.startDate || undefined,
        end: result.endDate || undefined,
        assignedToId: result.assignedToId,
        color: result.color
      }
      setEvents(prevEvents => [...prevEvents, formattedEvents])

      toast.success('Task created successfully!')
      if (setNewEventDialogOpen) {
        setNewEventDialogOpen(false)
      }
      form.reset()
    } catch (err) {
      console.log(err)

      toast.error(err.message, {
        description: err.suggestion || 'Please try again later'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      {isSubmitting && <Progress value={70} className='mb-4 w-full' />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={'grid grid-cols-1 md:grid-cols-2 gap-4'}
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
                    className='w-full'
                  />
                </FormControl>

                <div className='min-h-[10px]'>
                  <FormMessage />
                </div>
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
                    onChange={date => field.onChange(date?.toISOString() || '')}
                  />
                </FormControl>
                <div className='min-h-[10px]'>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* End DateTime Picker */}
          <FormField
            control={form.control}
            name='endDate'
            render={({ field }) => {
              const startDate = form.watch('startDate')
              return (
                <FormItem>
                  <FormLabel>End Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? new Date(field.value) : null}
                      onChange={date =>
                        field.onChange(date?.toISOString() || '')
                      }
                      disabled={!startDate} // disables the picker if no startDate
                      minDate={startDate ? new Date(startDate) : undefined} // ensure endDate >= startDate
                    />
                  </FormControl>
                  <div className='min-h-[10px]'>
                    <FormMessage />
                  </div>
                </FormItem>
              )
            }}
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
                  onValueChange={field.onChange}
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
                <div className='min-h-[10px]'>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Description (span 2 columns)  */}
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
                    className='w-full'
                  />
                </FormControl>
                <div className='min-h-[10px]'>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* color  */}

          {newEventDialogOpen && (
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
          <div className='col-span-1 md:col-span-2'>
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Task'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
