'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
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
import { ColorPicker } from '../color-picker'
import { useUser } from '@/lib/UserContext'
import { DateTimePicker } from '../date-time-picker'

const formSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    assignedToId: z.string().optional(),
    companyId: z.string().optional(),
    createdBy: z.string().optional(),
    color: z.string().min(1, 'Color is required')
  })
  .refine(data => data.endDate >= data.startDate, {
    message: 'End time must be after start time',
    path: ['endDate']
  })

export default function CalendarNewEventDialog () {
  const { user } = useUser()
  const { newEventDialogOpen, setNewEventDialogOpen, date, events, setEvents } =
    useCalendarContext()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: date,
      endDate: date,
      assignedToId: '',
      companyId: user?.companyId || '',
      createdBy: user?.id || '',
      color: 'blue'
    }
  })

  function onSubmit (values) {
    const newEvent = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      start: values.startDate.toISOString(),
      end: values.endDate.toISOString(),
      color: values.color,
      assignedToId: values.assignedToId,
      companyId: values.companyId,
      createdBy: values.createdBy
    }
    setEvents([...events, newEvent])
    setNewEventDialogOpen(false)
    form.reset()
  }

  return (
    <Dialog
      modal={false}
      open={newEventDialogOpen}
      onOpenChange={setNewEventDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold'>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Event description' {...field} />
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
                    <DateTimePicker field={field} />
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
                    <DateTimePicker field={field} />
                  </FormControl>
                  <FormMessage />
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

            <div className='flex justify-end'>
              <Button type='submit'>Create Event</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
