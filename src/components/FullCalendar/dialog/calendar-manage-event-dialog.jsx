import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
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
import { useCalendarContext } from '../calendar-context'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { ColorPicker } from '../color-picker'
import { DateTimePicker } from '@/components/DateTimePicker'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

const formSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(2, 'Description must be at least 2 characters'),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid start date'
    }),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid end date'
    }),
    assignedToId: z
      .string()
      .uuid({ message: 'Select one employee for this task' }),
    companyId: z.string().uuid({ message: 'Invalid company ID' }),
    remarks: z.string().optional(),
    color: z.string()
  })
  .refine(
    data => {
      try {
        const start = new Date(data.startDate)
        const end = new Date(data.endDate)
        return end >= start
      } catch {
        return false
      }
    },
    {
      message: 'End time must be after start time',
      path: ['end']
    }
  )

export default function CalendarManageEventDialog () {
  const {
    manageEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents
  } = useCalendarContext()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      assignedToId: '',
      companyId: '',
      color: 'blue'
    }
  })

  useEffect(() => {
    if (selectedEvent) {
      form.reset({
        title: selectedEvent.title,
        description: selectedEvent.description,
        startDate: format(selectedEvent.start, "yyyy-MM-dd'T'HH:mm"),
        endDate: format(selectedEvent.end, "yyyy-MM-dd'T'HH:mm"),
        assignedToId: selectedEvent.selectedEvent,
        color: selectedEvent.color
      })
    }
  }, [selectedEvent, form])

  function onSubmit (values) {
    if (!selectedEvent) return

    const updatedEvent = {
      ...selectedEvent,
      title: values.title,
      description: values.description,
      startDate: new Date(values.start),
      endDate: new Date(values.end),
      assignedToId: values.assignedToId,
      companyId: values.companyId,
      color: values.color
    }

    setEvents(
      events.map(event =>
        event.id === selectedEvent.id ? updatedEvent : event
      )
    )
    handleClose()
  }

  function handleDelete () {
    if (!selectedEvent) return
    setEvents(events.filter(event => event.id !== selectedEvent.id))
    handleClose()
  }

  function handleClose () {
    setManageEventDialogOpen(false)
    setSelectedEvent(null)
    form.reset()
  }

  return (
    <Dialog open={manageEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold'>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Event title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold'>Start</FormLabel>
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

            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold'>End</FormLabel>
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

            {/* <FormField
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
            /> */}

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      //disabled={isSubmitting}
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

            <DialogFooter className='flex justify-between gap-2'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='destructive' type='button'>
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete event</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this event? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type='submit'>Update event</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
