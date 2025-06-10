import { z } from "zod";

export const UserSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name must be under 100 characters' }),

  email: z.string().email({ message: 'Invalid email address' }),

  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' }),

  roleId: z
    .string({ required_error: 'Role is required' })
    .min(1, { message: 'Please select a role' }),

  role: z
    .string({ required_error: 'Role name is required' })
    .min(1, { message: 'Role name must be provided' }),

  companyId: z.string().optional(),

  createdBy: z.string().optional()
})
