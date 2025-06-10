'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { useUser } from '@/lib/UserContext'
import { LoginSchema } from '@/validation/authSchema'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { handleLogin } from '@/services/authService'
import { toast } from 'sonner'
import { Toggle } from '@/components/ui/toggle'
import { Moon, Sun } from 'lucide-react'

export default function LoginPage () {
  const { setUserContext } = useUser()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const onSubmit = async data => {
    await handleLogin({
      ...data,
      setUserContext,
      router,
      onSuccess: msg => toast.success(msg),
      onError: msg => toast.error('Login Failed', { description: msg })
    })
  }

  return (
    <div className='relative flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='absolute right-6 top-6'>
        <Toggle
          aria-label='Toggle theme'
          className={`h-9 w-2  rounded-full  ${
            theme === 'dark' ? 'bg-white ' : 'bg-black'
          }`}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun
              style={{
                height: '15px',
                width: '15  px'
              }}
              color='black'
            />
          ) : (
            <Moon size={24} />
          )}
        </Toggle>
      </div>
      <div className='w-full max-w-sm'>
        <div className={'flex flex-col gap-6'}>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='user@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='••••••••'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full'>
                    Login
                  </Button>

                  <div className='mt-4 text-center text-sm'>
                    Don&apos;t have an account?{' '}
                    <a href='#' className='underline underline-offset-4'>
                      Sign up
                    </a>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
