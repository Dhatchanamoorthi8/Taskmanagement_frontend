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
import { updateUser } from '@/services/userService'

export const EditUserForm = ({ userToEdit }) => {
  const { user } = useUser()
  const [otpVerified, setOtpVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [roles, setRoles] = useState([])

  const [originalEmail] = useState(userToEdit?.email || '')
  const [emailChanged, setEmailChanged] = useState(false)

  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      fullName: userToEdit?.fullName || '',
      email: userToEdit?.email || '',
      phone: userToEdit?.phone || '',
      role: userToEdit?.role || '',
      roleId: userToEdit?.roleId || '',
      companyId: userToEdit?.companyId || user?.companyId || ''
    }
  })

  const { isDirty } = form.formState

  console.log(isDirty, 'isDirty')

  // useEffect(() => {
  //   const currentEmail = form.watch('email')
  //   setEmailChanged(currentEmail !== originalEmail)
  //   if (currentEmail !== originalEmail) {
  //     setOtpVerified(false)
  //   } else {
  //     setOtpVerified(true)
  //   }
  // }, [form.watch('email'), originalEmail])

  useEffect(() => {
    const subscription = form.watch(value => {
      const currentEmail = value.email
      setEmailChanged(currentEmail !== originalEmail)
      setOtpVerified(currentEmail === originalEmail)
    })

    return () => subscription.unsubscribe()
  }, [form, originalEmail])

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
    if (emailChanged && !otpVerified) {
      form.setError('email', { message: 'Please verify your new email' })
      return
    }

    try {
      setIsSubmitting(true)
      setProgress(20)
      await updateUser({ id: userToEdit.id, ...data })
      setProgress(100)
      toast.success('User updated successfully!')
      form.reset(data)
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    } finally {
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
          <FormLabel
            className={`capitalize ${
              fieldName === 'email' && form.formState.errors.email ? 'mt-3' : ''
            }`}
          >
            {fieldName.replace(/([A-Z])/g, ' $1')}
          </FormLabel>
          <FormControl>
            <div
              className={`relative ${
                fieldName === 'email' && form.formState.errors.email
                  ? 'mt-4'
                  : ''
              }`}
            >
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

              {fieldName === 'email' &&
                form.watch('email') &&
                emailChanged &&
                !otpVerified && (
                  <div className='absolute right-2 top-1/2 -translate-y-1/2'>
                    <OtpVerifyer
                      email={form.watch('email')}
                      onVerified={() => setOtpVerified(true)}
                      emailexists={message =>
                        form.setError('email', { message })
                      }
                    />
                  </div>
                )}
            </div>
          </FormControl>

          <FormMessage />
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
                field.onChange(value)
                const selectedRole = roles.find(
                  role => String(role.id) === value
                )
                if (selectedRole) {
                  form.setValue('role', selectedRole.name)
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
            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  )

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Edit User</CardTitle>
        <CardDescription>
          Update user information and role below.
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
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {isSubmitting ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
