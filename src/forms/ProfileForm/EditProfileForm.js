import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Pencil } from 'lucide-react'
import Avatars from '@/lib/AvatarList'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useUser, setUserContext } from '@/lib/UserContext'
import { updateUserProfile } from '@/services/userService'
import { toast } from 'sonner'
import Image from 'next/image'

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  gender: z.string().nonempty('Gender is required'),
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  avatarurl: z.string()
})

export default function EditProfileForm ({ profileData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(
    profileData.avatarurl || ''
  )

  const dob = profileData.dateOfBirth
    ? new Date(profileData.dateOfBirth)
    : undefined
  const [date, setDate] = useState(dob)

  const { updateUserField } = useUser()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: profileData.fullName || '',
      gender: profileData.gender || '',
      dateOfBirth: dob,
      avatarurl: profileData.avatarurl || ''
    }
  })

  const handleSelect = avatarFile => {
    setSelectedAvatar(avatarFile)
    form.setValue('avatarurl', avatarFile)
    updateUserField('avatarurl', avatarFile)
    setIsOpen(false)
  }

  const onSubmit = async values => {
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth?.toISOString(),
      avatarurl: selectedAvatar
    }

    try {
      const updated = await updateUserProfile(profileData.id, payload)
      toast.success(updated.message)
      updateUserField('fullName', updated.user.fullName)
      updateUserField('gender', updated.user.gender)
      updateUserField('dateOfBirth', updated.user.dateOfBirth)
      updateUserField('avatarurl', updated.user.avatarurl)
    } catch (err) {
      console.log(err)

      toast.error('Update failed.')
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your profile details.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Avatar */}
        <div className='flex justify-center'>
          <div className=' relative'>
            <Avatar className='h-28 w-28   '>
              <AvatarImage src={`/avatars/${selectedAvatar}`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className='absolute bottom-0 right-0'>
              <Button
                className='w-8 h-8 p-0 rounded-full'
                variant='outline'
                onClick={() => setIsOpen(true)}
              >
                <Pencil className='h-4 w-4 mx-auto' />
              </Button>
            </div>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='max-w-4xl'>
              <DialogHeader>
                <DialogTitle>Select Your Avatar</DialogTitle>
              </DialogHeader>
              <ScrollArea className='h-72 w-full mt-4'>
                <div className='grid grid-cols-4 sm:grid-cols-6 gap-4 mt-4'>
                  {Avatars.map(avatar => {
                    return (
                      <button
                        key={avatar.id}
                        onClick={() => handleSelect(avatar.source)}
                        className={`overflow-hidden border-3 p-1 transition hover:border-white rounded-full ${
                          selectedAvatar === avatar.source
                            ? 'border-blue-500'
                            : 'border-transparent'
                        }`}
                      >
                        {/* <img
                          src={`/avatars/${avatar.source}`}
                          alt={`Avatar ${avatar.id}`}
                          className='rounded-full'
                        /> */}
                        <Image
                          src={`/avatars/${avatar.source}`}
                          alt={`Avatar ${avatar.id}`}
                          width={64} // You can adjust these sizes as needed
                          height={64}
                          className='rounded-full'
                          loading='lazy'
                        />
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <Separator className='bg-zinc-800 my-10' />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* fullName */}
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. Jhon' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email - not editable */}
            <div className='space-y-1'>
              <Label>Email</Label>
              <Input
                value={profileData.email}
                disabled
                className='cursor-not-allowed'
              />
            </div>

            {/* Gender & Date of Birth - Flex Row */}
            <div className='flex flex-col md:flex-row gap-4'>
              {/* Gender */}
              <div className='w-full'>
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full h-10'>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='male'>Male</SelectItem>
                          <SelectItem value='female'>Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date of Birth */}
              <div className='w-full'>
                <FormField
                  control={form.control}
                  name='dateOfBirth'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !date && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {date ? (
                                format(date, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={date}
                              onSelect={selected => {
                                setDate(selected)
                                field.onChange(selected) // update form field value
                              }}
                              monthFilter={true}
                              yearFilter={true}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='pt-4'>
              <Button type='submit' className='w-full md:w-fit'>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
