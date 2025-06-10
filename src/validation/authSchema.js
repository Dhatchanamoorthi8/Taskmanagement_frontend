import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters' })
})

// You can export more schemas here later:
export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email(),
  password: z.string().min(6)
})
