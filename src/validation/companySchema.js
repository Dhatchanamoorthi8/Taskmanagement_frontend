import { z } from 'zod'

export const CompanySchema = z.object({
  companyName: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters' }),
  registrationNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .nonempty({ message: 'Email is required' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .nonempty({ message: 'Phone number is required' }),
  website: z.preprocess(
    val => (val === '' ? undefined : val),
    z.string().url({ message: 'Invalid website URL' }).optional()
  ),
  logoUrl: z.preprocess(
    val => (val === '' ? undefined : val),
    z.string().url({ message: 'Invalid logo URL' }).optional()
  ),

  address: z.string().optional()
})
