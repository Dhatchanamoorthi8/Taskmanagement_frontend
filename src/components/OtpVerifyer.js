import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp'
import { toast } from 'sonner'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { sendOtp, verifyOtp } from '@/services/otpService'

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.'
  })
})

export function OtpVerifyer ({ email, onVerified, emailexists }) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: ''
    }
  })

  useEffect(() => {
    if (open && email) {
      sendOtp(email)
        .then(() => toast.success('OTP sent to your email'))
        .catch(err => {
          setOpen(false)
          emailexists(err.message)
          toast.error(err.message)
        })
    }
  }, [open, email])

  const onSubmit = async data => {
    try {
      const res = await verifyOtp(email, data.pin)
      onVerified?.()
      toast.success('OTP Verified Successfully!')
      form.reset()
      setOpen(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={false} disabled={!email}>
        <Button size='sm' variant='outline' disabled={!email}>
          Verify
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Verify Email</DialogTitle>
          <DialogDescription>
            Enter the OTP sent to your email address.
          </DialogDescription>
        </DialogHeader>

        <div className='flex justify-center py-5 '>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full space-y-6 px-2 sm:px-4'
            >
              <FormField
                control={form.control}
                name='pin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email
                      address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end'>
                <Button type='submit'>Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
