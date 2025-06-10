'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSchema } from '@/validation/userSchema'
import { fetchAllrole } from '@/services/roleService'
import { useUser } from '@/lib/UserContext'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { OtpVerifyer } from '@/components/OtpVerifyer'
import { createUser } from '@/services/userService'

export const AddUserForm = () => {
  const { user } = useUser()
  const [otpVerified, setOtpVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [roles, setRoles] = useState([])

  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: '',
      roleId: '',
      companyId: user?.companyId || '',
      createdBy: user.id
    }
  })

  // Progress animation
  useEffect(() => {
    if (isSubmitting) {
      let value = 0
      const interval = setInterval(() => {
        value += 10
        setProgress(prev => (prev < 90 ? value : prev))
      }, 150)
      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [isSubmitting])

  useEffect(() => {
    const getRoles = async () => {
      try {
        const res = await fetchAllrole({ companyId: user?.companyId })
        setRoles(res.roles || [])
      } catch (error) {
        toast.error('Failed to load roles')
      }
    }
    if (user?.companyId) getRoles()
  }, [user])

  const onSubmit = async data => {
    if (!otpVerified) {
      toast.error('Please verify your email with OTP before submitting.')
      return
    }
    try {
      setIsSubmitting(true)
      setProgress(20)
      await createUser(data)
      setProgress(100)
      toast.success('User created successfully!')
      form.reset()
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setOtpVerified(false)
      setIsSubmitting(false)
    }
  }

  const renderInputField = (fieldName, type = 'text') => (
    <FormField
      key={fieldName}
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>
            {fieldName.replace(/([A-Z])/g, ' $1')}
          </FormLabel>
          <FormControl>
            <div className='relative'>
              <Input
                {...field}
                type={type}
                disabled={isSubmitting}
                placeholder={
                  fieldName === 'fullName'
                    ? 'John Doe'
                    : fieldName === 'email'
                    ? 'user@email.com'
                    : fieldName === 'phone'
                    ? '9876543210'
                    : ''
                }
              />

              {fieldName === 'email' && form.watch('email') && (
                <div className='absolute right-2 top-1/2 -translate-y-1/2'>
                  <OtpVerifyer
                    email={form.watch('email')}
                    onVerified={() => setOtpVerified(true)}
                    emailexists={message => form.setError('email', { message })}
                  />
                </div>
              )}
            </div>
          </FormControl>
          <div className='min-h-[10px]'>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )

  const renderRoleDropdown = () => (
    <FormField
      control={form.control}
      name='roleId'
      render={({ field }) => (
        <div className='w-full'>
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select
              disabled={isSubmitting}
              onValueChange={value => {
                field.onChange(value) // sets roleId
                const selectedRole = roles.find(
                  role => String(role.id) === value
                )
                if (selectedRole) {
                  form.setValue('role', selectedRole.name) // sets role name
                }
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className='w-full h-10'>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='min-h-[10px]'>
              <FormMessage />
            </div>
          </FormItem>
        </div>
      )}
    />
  )

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>
          Fill in the user details to add a new team member.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitting && (
          <div className='mb-4'>
            <Progress value={progress} className='w-full' />
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'
          >
            {renderInputField('fullName')}
            {renderInputField('email', 'email')}
            {renderInputField('phone')}
            {renderRoleDropdown()}

            <div className='sm:col-span-2'>
              <Button
                type='submit'
                className='w-full'
                disabled={!otpVerified || isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
