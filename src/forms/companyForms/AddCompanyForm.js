'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CompanySchema } from '@/validation/companySchema'
import { registerCompany } from '@/services/companyService'
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
import { OtpVerifyer } from '@/components/OtpVerifyer'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export const AddCompanyForm = () => {
  const [otpVerified, setOtpVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)

  const form = useForm({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      email: '',
      companyName: '',
      registrationNumber: '',
      gstNumber: '',
      phone: '',
      website: '',
      logoUrl: '',
      address: ''
    }
  })

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

  const onSubmit = async data => {
    if (!otpVerified) {
      toast.error('Please verify your email with OTP before submitting.')
      return
    }

    try {
      setIsSubmitting(true)
      setProgress(20)
      await registerCompany(data)
      setProgress(100)
      toast.success('Company registered successfully!')
      form.reset()
      setOtpVerified(false)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = fieldName => (
    <FormField
      key={fieldName}
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem
          className={fieldName === 'address' ? 'col-span-2' : undefined}
        >
          <FormLabel className='capitalize'>
            {fieldName.replace(/([A-Z])/g, ' $1')}
          </FormLabel>
          <FormControl>
            <div className='relative'>
              <Input
                {...field}
                type={
                  fieldName === 'email'
                    ? 'email'
                    : fieldName === 'phone'
                    ? 'text'
                    : fieldName === 'website' || fieldName === 'logoUrl'
                    ? 'url'
                    : 'text'
                }
                disabled={isSubmitting}
                placeholder={
                  fieldName === 'companyName'
                    ? 'Company XYZ Pvt. Ltd.'
                    : fieldName === 'registrationNumber'
                    ? 'REG123456'
                    : fieldName === 'gstNumber'
                    ? '27ABCDE1234F2Z5'
                    : fieldName === 'email'
                    ? 'company@email.com'
                    : fieldName === 'phone'
                    ? '9876543210'
                    : fieldName === 'website'
                    ? 'https://example.com'
                    : fieldName === 'logoUrl'
                    ? 'https://logo-url.com/logo.png'
                    : fieldName === 'address'
                    ? '123 Main St, City, State, PIN'
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

          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Register Company</CardTitle>
        <CardDescription>
          Enter company details to access the dashboard
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
            className='grid grid-cols-2 gap-4 w-full'
          >
            {[
              'companyName',
              'registrationNumber',
              'gstNumber',
              'email',
              'phone',
              'website',
              'logoUrl',
              'address'
            ].map(fieldName => renderField(fieldName))}

            <div className='col-span-2'>
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
